import moment from "moment";
import { Logger } from "aws-amplify";
// eslint-disable-next-line no-unused-vars
const logger = new Logger("common.js", "ERROR");

/**
 * For getting the start of and end of any given week based on the users calendar and timezone.
 * Ex: from Sunday, June 21, 2020 12:00:00 AM GMT-05:00 to Saturday, June 27, 2020 11:59:59 PM GMT-05:00
 * @param {*} dateStrOrNumber if undefined it defaults to today otherwise the string
 * must be either ISO 8601 or RFC 2822 Date Time, or unix epoch timestamp in seoconds.
 * @returns object with fromDate and toDate as in epoch seconds
 */
export const getWorkWeek = (dateStrOrNumber) => {
  const today =
    typeof dateStrOrNumber === "number"
      ? moment.unix(dateStrOrNumber)
      : moment(dateStrOrNumber);
  const fromDate = today.startOf("week").unix();
  const toDate = today.endOf("week").unix();
  return { fromDate, toDate };
};

/**
 *
 * @param {*} dateStrOrNumber - options, date string or epoch seconds. Defaults to now.
 * @param {*} format - optional, default format is YYYY-MM-DD
 * @returns The data formated as defined by format
 */
export const formateDate = (
  dateStrOrNumber = new Date() / 1000,
  format = "YYYY-MM-DD"
) => {
  const date =
    typeof dateStrOrNumber === "number"
      ? moment.unix(dateStrOrNumber)
      : moment(dateStrOrNumber);
  return date.format(format);
};

export const SECONDS_IN_DAY = 60 * 60 * 24;

/**
 * Ignores time, always the date at midnight.
 * @param {*} dateString
 */
export const dateToUnixTimestamp = (dateString) => {
  return moment(dateString).startOf("day").unix();
};

/**
 *
 * @param {*} dateString
 */
export const dateTimeLocalToUnixTimestamp = (dateString) => {
  return moment(dateString).unix();
};

/**
 *
 * @param {*} mili
 * @returns
 */
export const getCounterFromMiliSeconds = (mili) => {
  return {
    days: Math.floor((mili / (1000 * 60 * 60 * 24)) % 24),
    hours: Math.floor((mili / (1000 * 60 * 60)) % 60),
    minutes: Math.floor((mili / (1000 * 60)) % 60),
    seconds: Math.floor(mili / 1000) % 60,
  };
};

/**
 *
 * @param {*} timeInMinutes
 * @returns Time formatted as HH:MM, or 00:00
 */
export const getFormatedTime = (timeInMinutes = 0) => {
  if (timeInMinutes > 0) {
    const minutes = timeInMinutes % 60;
    const hours = (timeInMinutes - minutes) / 60;
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  } else {
    return "00:00";
  }
};
/**
 *
 * @param {*} minute
 * @param {*} hourlyRate
 * @returns
 */
export const getEarnings = (minute = 0, hourlyRate = 0) =>
  (minute / 60) * hourlyRate;

/**
 *
 * @param {*} epochSecondsStart
 * @param {*} epochSecondsEnd
 * @param {*} ignoreSeconds - default is true
 * @returns the number of minutes that has passed, if ignoreSeconds than a clock out at 12:30.59 and a clock in at 12:45.01 whould show 15 minutes
 */
export const getTimeDifference = (
  epochSecondsStart = 0,
  epochSecondsEnd = 0,
  ignoreSeconds = true
) => {
  if (!epochSecondsEnd || epochSecondsEnd <= epochSecondsStart) return 0;
  return ignoreSeconds
    ? Math.floor(epochSecondsEnd / 60) - Math.floor(epochSecondsStart / 60)
    : epochSecondsEnd - epochSecondsStart;
};

/**
 *
 * @param {*} epochSeconds
 * @returns the current time in ISO formate (YYYY-MM-DDTHH:mm)
 * or any other time if epochSeconds are provided.
 */
export const getDateLocal = (epochSeconds) => {
  const epoch = epochSeconds ? epochSeconds * 1000 : new Date().getTime();
  return moment(epoch).format("YYYY-MM-DDTHH:mm");
};

/**
 * Converts a photo's data uri to a BLOB for uploading photo to content server
 * @param {*} dataURI
 */
export const getBlobFromDataURI = (dataURI) => {
  try {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  } catch (e) {
    logger.debug("Failed to proccess dataURI", e);
    return null;
  }
};

/**
 *
 * @param {*} seconds - defaults to true and returns time in seconds instead of milseconds
 */
export const getEpoch = (seconds = true) =>
  Math.round(new Date().getTime() / (seconds ? 1000 : 1));

/**
 *
 * @param {*} name
 */
export const parseFullName = (name) => {
  let firstName = "",
    lastName = "";

  if (name) {
    const parts = name.split(" ");
    const midIdx = Math.floor(parts.length / 2);

    firstName += parts[0];
    for (let i = 1; i < parts.length; i++) {
      if (i < midIdx) {
        firstName += " " + parts[i];
      } else if (i === midIdx) {
        lastName = parts[i];
      } else {
        lastName += " " + parts[i];
      }
    }
  }

  return { firstName, lastName };
};

/**
 *
 * @param {*} l1
 * @param {*} l2
 * @param {*} compareFunc a comparitor function returning -1 if l1 < l2,
 * 0 if l1 === l2, or otherwise 1
 * @param {*} ascending - defaults to true, set to false if list is in decending order
 * @param {*} allowDuplicates - defaults to false
 * @returns a new, combined sorted list out of the two
 */
export const mergeSortedLists = (
  l1,
  l2,
  compareFunc,
  ascending = true,
  allowDuplicates = false
) => {
  let l1Idx = 0,
    l2Idx = 0;
  const retVal = [];
  const multiplier = ascending ? 1 : -1;
  while (l1Idx < l1.length && l2Idx < l2.length) {
    switch (compareFunc(l1[l1Idx], l2[l2Idx]) * multiplier) {
      case -1:
        retVal[retVal.length] = l1[l1Idx++];
        break;
      case +0:
      case -0:
        allowDuplicates ? (retVal[retVal.length] = l1[l1Idx++]) : l1Idx++;
        retVal[retVal.length] = l2[l2Idx++];
        break;
      case 1:
        retVal[retVal.length] = l2[l2Idx++];
        break;
      default:
        throw new Error(
          "Compare function should only return the following values -1, 0, 1"
        );
    }
  }
  if (l1Idx < l1.length) {
    for (; l1Idx < l1.length; l1Idx++) retVal[retVal.length] = l1[l1Idx];
  }
  if (l2Idx < l2.length) {
    for (; l2Idx < l2.length; l2Idx++) retVal[retVal.length] = l2[l2Idx];
  }
  return retVal;
};

/**
 *
 * @param {*} str
 * @returns true if the string contains only digits (0-9) otherwise false
 */
export const isDigits = (str) => /^\d+$/.test(str);
