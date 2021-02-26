import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { DialogTemplate } from "../components";
import { WebcamCapture, CenterContent } from "components";
import { getBlobFromDataURI, getEpoch } from "helpers";
import PropTypes from "prop-types";
import { useClockIn, useClockOut, useUploadImage } from "hooks";
import { v4 as uuidv4 } from "uuid";

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

const Saving = (props) => {
  const { message } = props;
  return (
    <CenterContent>
      <CircularProgress />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </CenterContent>
  );
};
Saving.propTypes = { message: PropTypes.string };

/**
 *
 * @param {*} props
 */
const ClockingIn = (props) => {
  const { input, onSuccess, onError = () => {} } = props;
  const [runQuery, { loading, error, data }] = useClockIn();

  useEffect(() => {
    if (input) runQuery({ variables: { input } });
  }, [input, runQuery]);

  useEffect(() => {
    if (!loading && !error && data) onSuccess(data.clockIn);
  }, [loading, onSuccess, data, error]);

  useEffect(() => {
    if (!loading && error) onError(error);
  }, [error, onError, loading]);

  return <Saving message="Clocking you in..." />;
};
ClockingIn.propTypes = {
  input: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

/**
 *
 * @param {*} props
 */
const ClockingOut = (props) => {
  const { input, onSuccess, onError = () => {} } = props;
  const [runQuery, { loading, error, data }] = useClockOut();

  useEffect(() => {
    if (input) runQuery({ variables: { input } });
  }, [input, runQuery]);

  useEffect(() => {
    if (!loading && !error && data) onSuccess(data.clockOut);
  }, [loading, onSuccess, data, error]);

  useEffect(() => {
    if (!loading && error) onError(error);
  }, [error, onError, loading]);
  return <Saving message="Clocking you out..." />;
};
ClockingOut.propTypes = {
  input: PropTypes.object,
  onError: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
};

/**
 *
 * @param {*} props
 */
const ClockingInOrOut = (props) => {
  const { input, imageVars, onSuccess, clockIn, onError = () => {} } = props;
  const [{ clockIn: clockingIn, ...propState }] = useState({
    clockIn,
    input,
    onSuccess,
    onError,
  });
  const [uploadImg, { error, response }] = useUploadImage();

  useEffect(() => {
    if (imageVars) uploadImg(imageVars.fileName, imageVars.imgBlob);
  }, [imageVars, uploadImg]);

  return imageVars && !response && !error ? (
    <Saving message="Saving your selfie..." />
  ) : clockingIn ? (
    <ClockingIn {...propState} />
  ) : (
    <ClockingOut {...propState} />
  );
};
ClockingInOrOut.propTypes = {
  input: PropTypes.object,
  imageVars: PropTypes.object,
  clockIn: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

/**
 *
 * @param {*} props
 */
const ClockinDialog = (props) => {
  const { open, handleClose: hc, isClockedIn, employee, latestRecord } = props;
  const inOrOut = isClockedIn ? "out" : "in";

  useEffect(() => {}, []);

  const webcamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [formState, setFormState] = useState({});
  const [timerecordInput, setTimerecordInput] = useState(null);
  const [imageVars, setImageVars] = useState(null);

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
    setIsReady(false);
    setFormState({});
    setTimerecordInput(null);
    setImageVars(null);
    hc();
  }, [hc]);

  /**
   * handles clock in or out
   */
  const handleClick = useCallback(() => {
    const { companyId, payRates = [{}] } = employee;
    const [rate] = payRates || [{}];
    const { __typename, ...rest } = rate;
    const imgDataURI = webcamRef.current.getScreenshot();
    // TODO (): What if there isn't a photo because the camera was blocked
    const imgBlob = getBlobFromDataURI(imgDataURI);
    const fileName = `accts/${companyId}/time-imgs/${uuidv4()}.png`;
    const imgName = !imgBlob ? undefined : fileName;
    const input = {
      photo: imgName,
      note: formState.note,
      rate: !isClockedIn && __typename ? rest : undefined,
      id: !isClockedIn ? undefined : latestRecord.id,
      _version: !isClockedIn ? undefined : latestRecord._version,
    };
    if (imgName) setImageVars({ fileName, imgBlob });
    setTimerecordInput(input); // This will cause SavingTimeRecord to launch
  }, [employee, formState.note, isClockedIn, latestRecord]);

  const actions = [];

  const clockInBtn = (
    <Button
      key="clockIn"
      autoFocus
      disabled={!isReady || !!timerecordInput}
      onClick={handleClick}
      color="secondary"
    >
      {isReady ? `Clock-${inOrOut}` : "Loading camera..."}
    </Button>
  );
  const cancleBtn = (
    <Button
      key="cancel"
      disabled={!!timerecordInput}
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
      handleClose={timerecordInput ? () => {} : handleClose}
      title={`Clock${timerecordInput ? "ing" : ""}-${inOrOut}`}
      dialogContent={
        timerecordInput || !open ? (
          <ClockingInOrOut
            input={timerecordInput}
            clockIn={!isClockedIn}
            imageVars={imageVars}
            onSuccess={handleClose}
          />
        ) : (
          <ClockInContent
            webcamRef={webcamRef}
            onReady={handleReady}
            onError={handleCameraError}
            onChange={handleChange}
            note={formState.note || ""}
          />
        )
      }
      actions={actions}
    />
  );
};

ClockinDialog.propTypes = {
  isClockedIn: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  employee: PropTypes.object.isRequired,
  latestRecord: PropTypes.object,
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};

export default ClockinDialog;
