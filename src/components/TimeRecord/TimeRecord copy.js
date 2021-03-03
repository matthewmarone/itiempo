import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { Image } from "components";
import { DialogTemplate } from "components/Dialogs/components";
import {
  getDateLocal,
  getFormatedTime,
  getTimeDifference,
  dateTimeLocalToUnixTimestamp,
} from "helpers";
import { useDownloadImage } from "hooks";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  imageSize: { maxHeight: "175px" },
});

const TimeRecord = (props) => {
  const {
    open,
    saving,
    newTimesheet = false,
    record,
    onClose,
    onSave,
    onChange,
  } = props;
  const classes = useStyles();
  const { timestampIn, timestampOut, clockInDetails, clockOutDetails } = record;
  const {
    photo: photoIn,
    note: noteIn,
    ipAddress: ipAddressIn,
  } = clockInDetails;
  const { photo: photoOut, note: noteOut, ipAddress: ipAddressOut } =
    clockOutDetails || {};
  const [setClockInImageVars, { data: clockInImage }] = useDownloadImage();
  const [setClockOutImageVars, { data: clockOutImage }] = useDownloadImage();

  const [
    formatedTimeIn,
    formatedTimeOut,
    formatedTotalTime,
  ] = React.useMemo(() => {
    const ti = timestampIn ? getDateLocal(timestampIn) : "";
    const to = timestampOut ? getDateLocal(timestampOut) : "";
    return [
      ti,
      to,
      getFormatedTime(getTimeDifference(timestampIn, timestampOut)),
    ];
  }, [timestampIn, timestampOut]);

  useEffect(() => {
    if (open) {
      setClockInImageVars({ key: photoIn });
      setClockOutImageVars({ key: photoOut });
    }
  }, [photoIn, open, photoOut, setClockInImageVars, setClockOutImageVars]);

  const handleTextChange = React.useCallback(
    ({ target: { name, value } }) => {
      onChange(
        name,
        name.includes("timestamp") ? dateTimeLocalToUnixTimestamp(value) : value
      );
    },
    [onChange]
  );
  const noImg = "/images/avatars/user-silhouette.svg";
  const dialogContent = (
    <Grid container spacing={3}>
      {saving ? (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item xs={12}>
            <Typography color="primary" variant="h4">
              {formatedTotalTime}
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              required
              fullWidth
              type="datetime-local"
              label="Time In"
              name="timestampIn"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={formatedTimeIn}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              required
              fullWidth
              type="datetime-local"
              label="Time Out"
              name="timestampOut"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={formatedTimeOut}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {newTimesheet || (
            <React.Fragment>
              <Grid item sm={6} xs={12}>
                <Image
                  imgClass={classes.imageSize}
                  src={photoIn ? clockInImage : noImg}
                  alt="Clock in"
                  label="Clock-in:"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Image
                  imgClass={classes.imageSize}
                  src={photoOut ? clockOutImage : noImg}
                  alt="Clock out"
                  label="Clock-out:"
                />
              </Grid>
            </React.Fragment>
          )}
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              multiline
              label="Clock-in Note"
              name="noteIn"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={noteIn || ""}
              rows={3}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              multiline
              label="Clock-out Note"
              name="noteIn"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={noteOut || ""}
              rows={3}
            />
          </Grid>
          {newTimesheet || (
            <React.Fragment>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label="IP Address @ Clock-in"
                  margin="dense"
                  name="ipAddress_in"
                  value={ipAddressIn}
                  variant="standard"
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  label="IP Address @ Clock-out"
                  margin="dense"
                  name="ipAddress_out"
                  value={ipAddressOut}
                  variant="standard"
                />
              </Grid>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Grid>
  );

  const saveButton = React.useMemo(
    () => (
      <Button key="saveBtn" onClick={onSave} color="secondary">
        Save
      </Button>
    ),
    [onSave]
  );
  const closeBtn = React.useMemo(
    () => (
      <Button key="closeBtn" onClick={onClose} color="primary">
        Close
      </Button>
    ),
    [onClose]
  );
  const actions = [saveButton, closeBtn];

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title="Time Record Details"
      dialogContent={dialogContent}
      actions={actions}
    />
  );
};

TimeRecord.propTypes = {
  record: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TimeRecord;
