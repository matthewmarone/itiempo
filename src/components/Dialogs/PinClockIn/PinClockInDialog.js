import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { usePunchInByPin, useUploadImage, useEmployeePayRates } from "hooks";
import { default as EnterPinDialog } from "../EnterPin";
import { default as ClockinDialogTwo } from "../ClockinTwo";
import { default as ClockSuccessDialog } from "../ClockSuccess";
import { v4 as uuidv4 } from "uuid";

const scene = {
  pinPad: "pinPad",
  photoAndNote: "photoAndNote",
  loading: "loading",
  success: "success",
};

/**
 *
 * @param {*} props
 */
const PinClockInDialog = (props) => {
  const { open, onClose, pinRecords } = props;
  const [showScene, setShowScene] = useState(scene.pinPad);
  const [pin, setPin] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [punchIn, { loading, error, data }] = usePunchInByPin();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadImg, { error: imgError }] = useUploadImage();
  const [timeRecord, setTimeRecord] = useState(null);
  const [setId, { data: { employeePayRates } = {} } = {}] = useEmployeePayRates(
    selectedRecord?.employeeId
  );
  useEffect(() => {
    setId(selectedRecord?.employeeId);
  }, [selectedRecord, setId]);

  if (imgError) console.warn("Failed to upload image", imgError);

  useEffect(() => {
    if (error) {
      const { message } = error;
      let displayMessage;
      switch (message) {
        case "Incorrect Pin:":
          displayMessage = "Pin entered was incorrect.";
          break;

        default:
          displayMessage = "An error occurred, please try fully logging in.";
          break;
      }
      console.log("PunchIn Error", error);
      clear(displayMessage);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && data?.punchInByPin?.length > 0) {
      setTimeRecord(JSON.parse(data.punchInByPin));
      setShowScene(scene.success);
    }
  }, [data, loading]);

  useEffect(() => {
    if (open) clear();
  }, [open]);

  const clear = (err) => {
    setShowScene(scene.pinPad);
    setPin(null);
    setSelectedRecord(null);
    setTimeRecord(null);
    setErrorMessage(err);
  };

  const handleClose = useCallback(() => onClose(), [onClose]);
  /**
   *
   */
  const handlePinSubmit = useCallback(({ record, pin }) => {
    setPin(pin);
    setSelectedRecord(record);
    setShowScene(scene.photoAndNote);
  }, []);
  /**
   *
   */
  const handleClockInSubmit = useCallback(
    ({ photoBlob, note, rateName }) => {
      console.log(pin, selectedRecord, photoBlob, note);
      const { id, companyId } = selectedRecord;
      const fileName = photoBlob
        ? `accts/${companyId}/time-imgs/${uuidv4()}.png`
        : undefined;
      if (fileName) uploadImg(fileName, photoBlob);
      const input = {
        quickPunchId: id,
        base64Ident: btoa(pin),
        rateName,
        punchCardDetails: { photo: fileName, note },
      };

      punchIn({ variables: { input } });

      setShowScene(scene.loading);
    },
    [pin, punchIn, selectedRecord, uploadImg]
  );

  const getScene = useCallback(
    (s) => {
      switch (s) {
        case scene.loading:
        case scene.success:
          return (
            <ClockSuccessDialog
              open={open}
              onClose={handleClose}
              record={timeRecord}
              employeeId={selectedRecord?.employeeId}
            />
          );
        case scene.photoAndNote:
          return (
            <ClockinDialogTwo
              open={open}
              onClose={handleClose}
              onSubmit={handleClockInSubmit}
              payRates={employeePayRates}
            />
          );
        case scene.pinPad:
        default:
          return (
            <EnterPinDialog
              open={open}
              pinRecords={pinRecords}
              onClose={handleClose}
              onSubmit={handlePinSubmit}
              errorMessage={errorMessage}
            />
          );
      }
    },
    [
      employeePayRates,
      errorMessage,
      handleClockInSubmit,
      handleClose,
      handlePinSubmit,
      open,
      pinRecords,
      selectedRecord?.employeeId,
      timeRecord,
    ]
  );

  return getScene(showScene);
};

PinClockInDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pinRecords: PropTypes.array.isRequired,
};

export default PinClockInDialog;
