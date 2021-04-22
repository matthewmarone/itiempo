import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Typography, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { useVerse } from "hooks";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "left",
  },
  hideButtonContainer: {
    textAlign: "left",
  },
  hideButton: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  verse: {
    paddingLeft: theme.spacing(1),
  },
  disclaimer: { textAlign: "center" },
}));

const prefKey = "itiempo.sv";
/**
 *
 * @returns the existing prefrences or an empty object
 */
const getShowPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(prefKey)) || {};
  } catch (e) {
    console.error(e);
    return {};
  }
};

const setShowPrefs = (prefObj) => {
  try {
    localStorage.setItem(prefKey, JSON.stringify(prefObj));
  } catch (e) {
    console.error(e);
  }
};

/**
 *
 * @param {*} employeeId
 * @returns true, unless the employee specifically asks not to show verses
 */
const getPreference = (employeeId) => getShowPrefs()[employeeId] !== false;
/**
 *
 * @param {*} employeeId
 * @returns
 */
const useShow = (employeeId) => {
  const [eId, setEmployeeId] = useState(employeeId);
  const [show, setShow] = useState(getPreference(eId));

  // Lookup show if employee changes
  useState(() => setShow(getPreference(eId)), [eId]);

  const setShowPreference = useCallback(
    (show) => {
      setShow(show);
      if (eId) {
        setShowPrefs({ ...getShowPrefs(), [eId]: show === true });
      }
    },
    [eId]
  );

  return [setEmployeeId, { show, setShow: setShowPreference }];
};

/**
 *
 * @param {*} props
 * @returns
 */
const Verse = (props) => {
  const classes = useStyles();
  const { lang, employeeId } = props;
  const [verse, setVerseOptions] = useVerse({ lang: lang || "en" });
  const [setEmployeeId, { show, setShow }] = useShow(employeeId);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (lang) setVerseOptions({ lang });
  }, [lang, setVerseOptions]);

  useEffect(() => {
    if (employeeId) setEmployeeId(employeeId);
  }, [employeeId, setEmployeeId]);

  const handleShowHide = () => {
    const newShow = !show;
    setShow(newShow);
    setShowDisclaimer(newShow === false);
  };

  const citation = useMemo(() => {
    if (verse) {
      const {
        book,
        chapter,
        verseStart: vs,
        verseEnd: ve,
        translation,
      } = verse;
      return `${book} ${chapter}:${vs}${
        !ve || ve === vs ? `` : `-${ve}`
      } (${translation})`;
    } else {
      return "";
    }
  }, [verse]);

  return (
    <div>
      <Collapse in={show} timeout="auto">
        <Typography className={classes.title} variant="h6" gutterBottom>
          Verse of the Day:
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          gutterBottom
          className={classes.verse}
        >
          <i>{verse?.text || ""}</i>
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          className={classes.verse}
        >
          ~ {citation}
        </Typography>
      </Collapse>
      <Typography
        className={classes.hideButtonContainer}
        variant="body2"
        color="secondary"
      >
        <span className={classes.hideButton} onClick={handleShowHide}>
          {show ? "Hide" : "Show"} verses
        </span>
      </Typography>
      <Collapse in={showDisclaimer} timeout="auto">
        <Typography
          className={classes.disclaimer}
          variant="body2"
          color="error"
        >
          Verse of the Day will now remain hidden automatically on this device.
          You can unhide at anytime by clicking "Show verses" above.
        </Typography>
      </Collapse>
    </div>
  );
};
Verse.propTypes = { lang: PropTypes.string, employeeId: PropTypes.string };

export default Verse;
