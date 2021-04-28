import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from "@material-ui/core";
import { DialogTemplate } from "../components";
import { WebcamCapture } from "components";
import { getBlobFromDataURI } from "helpers";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  wageSelectRoot: {
    minWidth: "15em",
  },
}));

/**
 *
 * @param {*} props
 */
const ClockInContent = (props) => {
  const classes = useStyles();
  const { webcamRef, onReady, onError, onChange, note, payRates, rate } = props;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormControl classes={{ root: classes.wageSelectRoot }}>
          <InputLabel htmlFor="pin-user-select">Pay Rate</InputLabel>
          <Select
            native
            value={rate || ""}
            onChange={onChange}
            inputProps={{
              name: "rate",
              id: "rate-select",
            }}
            color="primary"
            size="large"
          >
            <option aria-label="None" value="" />
            {payRates?.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </FormControl>
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
  note: PropTypes.string.isRequired,
  payRates: PropTypes.array,
  rate: PropTypes.string,
};

/**
 *
 * @param {*} props
 */
const ClockinDialogTwo = (props) => {
  const { open, onClose, onSubmit, payRates } = props;
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
    console.warn(e);
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
    onSubmit({ photoBlob, note: formState.note, rateName: formState.rate });
  }, [formState, onSubmit]);

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
    <Button key="cancel" onClick={handleClose} color="primary">
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
          payRates={payRates}
          note={formState.note || ""}
          rate={formState.rate || ""}
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
  payRates: PropTypes.array,
};

export default ClockinDialogTwo;
