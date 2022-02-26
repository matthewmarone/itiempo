import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  Grid,
} from "@material-ui/core";
import { DialogTemplate } from "../components";
import {
  WebcamCapture,
  CenterContent,
  Verse,
  EmployeePayRateSelect,
} from "components";
import { getBlobFromDataURI, isValidPayRate } from "helpers";
import PropTypes from "prop-types";
import { useClockIn, useClockOut, useUploadImage } from "hooks";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  wageSelectRoot: {
    minWidth: "15em",
  },
  hide: {
    display: "none",
    visibility: "hidden",
  },
}));

/**
 *
 * @param {*} props
 */
const ClockInContent = (props) => {
  const classes = useStyles();
  const {
    webcamRef,
    rate,
    payRates,
    onReady,
    onError,
    onChange,
    note,
    isClockedIn,
  } = props;
  const handlePayRateChange = (value) =>
    onChange({ target: { name: "rate", value } });
  return (
    <Grid container spacing={1}>
      <Grid item className={clsx(isClockedIn && classes.hide)} xs={12}>
        <EmployeePayRateSelect
          rate={rate}
          payRates={payRates}
          onChange={handlePayRateChange}
          classes={{ root: classes.wageSelectRoot }}
        />
      </Grid>
      <Grid item xs={12}>
        <WebcamCapture
          ref={webcamRef}
          onReady={onReady}
          onUserMediaError={onError}
          screenshotQuality={0.1}
        />
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};
ClockInContent.propTypes = {
  webcamRef: PropTypes.any.isRequired,
  onReady: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  payRates: PropTypes.array.isRequired,
  payRateIndex: PropTypes.string,
  note: PropTypes.string,
  isClockedIn: PropTypes.bool,
};

const Saving = (props) => {
  const { saving, message, employeeId } = props;
  return (
    <CenterContent>
      {!saving ? (
        <Typography
          variant="body1"
          color={!saving ? "primary" : "textSecondary"}
        >
          &nbsp;
        </Typography>
      ) : (
        <CircularProgress />
      )}
      <Typography variant="body1" color={!saving ? "primary" : "textSecondary"}>
        {message}
      </Typography>
      <Verse employeeId={employeeId} />
    </CenterContent>
  );
};
Saving.propTypes = {
  saving: PropTypes.bool,
  message: PropTypes.string,
};

/**
 *
 * @param {*} props
 */
const ClockingIn = (props) => {
  const { input, onSuccess, onError = () => {}, employeeId } = props;
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

  return <Saving saving message="Clocking you in..." employeeId={employeeId} />;
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
  const { input, onSuccess, onError = () => {}, employeeId } = props;
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

  return (
    <Saving saving message="Clocking you out..." employeeId={employeeId} />
  );
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
  const {
    input,
    imageVars,
    onSuccess,
    clockIn,
    onError = () => {},
    employeeId,
  } = props;
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
    <Saving saving message="Saving your selfie..." employeeId={employeeId} />
  ) : clockingIn ? (
    <ClockingIn {...propState} employeeId={employeeId} />
  ) : (
    <ClockingOut {...propState} employeeId={employeeId} />
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

  const webcamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [formState, setFormState] = useState({});
  const [timerecordInput, setTimerecordInput] = useState(null);
  const [imageVars, setImageVars] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback(
    (e) => {
      setFormState({ ...formState, [e.target.name]: e.target.value });
    },
    [formState]
  );

  const handleCameraError = useCallback((e) => {
    // TODO (): Implement case where users camera dosen't work
    console.warn(e);
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
    setSuccess(false);
    hc();
  }, [hc]);

  /**
   * handles clock in or out
   */
  const handleClick = useCallback(() => {
    const { companyId } = employee;
    const { __typename, ...rest } = formState?.rate || {};
    const imgDataURI = webcamRef.current.getScreenshot();
    // TODO (): What if there isn't a photo because the camera was blocked
    const imgBlob = getBlobFromDataURI(imgDataURI);
    const fileName = `accts/${companyId}/time-imgs/${uuidv4()}.png`;
    const imgName = !imgBlob ? undefined : fileName;
    const input = {
      rate: !isClockedIn && isValidPayRate(rest) ? rest : undefined,
      id: !isClockedIn ? undefined : latestRecord.id,
      _version: !isClockedIn ? undefined : latestRecord._version,
      // Always include these
      punchCardDetails: { photo: imgName, note: formState.note },
    };
    if (imgName) setImageVars({ fileName, imgBlob });
    setTimerecordInput(input); // This will cause SavingTimeRecord to launch
  }, [employee, formState, isClockedIn, latestRecord]);

  const actions = [];

  const clockInBtn = (
    <Button
      key="clockIn"
      autoFocus
      disabled={!isReady || !!timerecordInput}
      onClick={handleClick}
      color="primary"
      variant="contained"
    >
      {isReady ? `Clock ${!isClockedIn ? `In` : `Out`}` : "Loading camera..."}
    </Button>
  );
  const cancleBtn = (
    <Button
      key="cancel"
      disabled={!!timerecordInput && !success}
      onClick={handleClose}
      color="secondary"
      variant="outlined"
    >
      {!success ? "Cancel" : "Done"}
    </Button>
  );
  if (!success) actions.push(clockInBtn);
  actions.push(cancleBtn);

  return (
    <DialogTemplate
      open={open}
      handleClose={timerecordInput && !success ? () => {} : handleClose}
      title={`Clock ${
        isClockedIn ? (!success ? `Out` : `In`) : !success ? `In` : `Out`
      }`}
      dialogContent={
        timerecordInput || !open ? (
          !success ? (
            <ClockingInOrOut
              input={timerecordInput}
              clockIn={!isClockedIn}
              imageVars={imageVars}
              onSuccess={() => setSuccess(true)}
              employeeId={employee?.id}
            />
          ) : (
            <Saving
              message={`Done, you are clocked ${isClockedIn ? `in` : `out`}.`}
              employeeId={employee?.id}
            />
          )
        ) : (
          <ClockInContent
            webcamRef={webcamRef}
            onReady={handleReady}
            onError={handleCameraError}
            onChange={handleChange}
            payRates={employee?.payRates}
            isClockedIn={isClockedIn}
            {...formState}
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
