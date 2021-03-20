import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, TextField } from "@material-ui/core";
import { DialogTemplate } from "../components";
import { WebcamCapture } from "components";
import { getBlobFromDataURI } from "helpers";
import PropTypes from "prop-types";

import { Logger } from "aws-amplify";
// eslint-disable-next-line no-unused-vars
const logger = new Logger("Clockin.js", "ERROR");

/**
 *
 * @param {*} props
 */
const ClockInContent = (props) => {
  const { webcamRef, onReady, onError, onChange, note } = props;
  return (
    <React.Fragment>
      <WebcamCapture
        ref={webcamRef}
        onReady={onReady}
        onUserMediaError={onError}
        screenshotQuality={0.1}
      />
      <TextField
        fullWidth
        label="Notes"
        name="note"
        value={note || ""}
        onChange={onChange}
        margin="dense"
        variant="outlined"
        multiline
        rows={3}
      />
    </React.Fragment>
  );
};
ClockInContent.propTypes = {
  webcamRef: PropTypes.any.isRequired,
  onReady: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
};

/**
 *
 * @param {*} props
 */
const ClockinDialogTwo = (props) => {
  const { open, onClose, onSubmit } = props;
  const webcamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [formState, setFormState] = useState({});

  const handleChange = useCallback(
    (e) => {
      setFormState({ ...formState, [e.target.name]: e.target.value });
    },
    [formState]
  );

  const handleCameraError = useCallback((e) => {
    // TODO (): Implement case where users camera dosen't work
    logger.warn(e);
    setIsReady(true);
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setIsReady(false);
      setFormState({});
    }
  }, [open]);

  const handleSubmit = useCallback(() => {
    const imgDataURI = webcamRef.current.getScreenshot();
    // TODO (): What if there isn't a photo because the camera was blocked
    const photoBlob = getBlobFromDataURI(imgDataURI);
    onSubmit({ photoBlob, note: formState.note });
  }, [formState.note, onSubmit]);

  const actions = [];

  const clockInBtn = (
    <Button
      key="clockIn"
      autoFocus
      disabled={!isReady}
      onClick={handleSubmit}
      color="secondary"
    >
      {isReady ? `Go` : "Loading camera..."}
    </Button>
  );
  const cancleBtn = (
    <Button
      key="cancel"
      onClick={handleClose}
      color="primary"
    >
      Cancel
    </Button>
  );
  actions.push(clockInBtn);
  actions.push(cancleBtn);

  return (
    <DialogTemplate
      open={open}
      handleClose={handleClose}
      title={"Clock In/Out"}
      dialogContent={
        <ClockInContent
          webcamRef={webcamRef}
          onReady={handleReady}
          onError={handleCameraError}
          onChange={handleChange}
          note={formState.note || ""}
        />
      }
      actions={actions}
    />
  );
};

ClockinDialogTwo.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ClockinDialogTwo;
