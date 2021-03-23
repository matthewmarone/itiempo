import React, { useState, useCallback, useContext, useEffect } from "react";
import { Context } from "Store";
import {
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { DialogTemplate } from "components/Dialogs/components";
import { default as SingleEmployeeSelect } from "../SingleEmployeeSelect";
import { default as EmployeeName } from "../EmployeeName";
import {
  getDateLocal,
  getFormatedTime,
  getTimeDifference,
  dateTimeLocalToUnixTimestamp,
} from "helpers";
import { useCreateTimeRecord, useUpdateTimeRecord } from "hooks";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  selectRoot: {
    minWidth: "10em",
  },
});

/**
 *
 * @param {*} record
 */
const getInitialState = (record, eId) => {
  const {
    id,
    employeeId = eId,
    timestampIn,
    timestampOut,
    clockInDetails,
    clockOutDetails,
    _version,
  } = record || {};
  const { note: noteIn } = clockInDetails || {};
  const { note: noteOut } = clockOutDetails || {};
  return {
    id,
    employeeId,
    timestampIn,
    timestampOut,
    noteIn,
    noteOut,
    _version,
  };
};

/**
 *
 * @param {*} props
 */
const CreateRecord = (props) => {
  const { initialState, open, onClose, onSaving } = props;
  const [formState, setFormState] = useState({ ...initialState });
  const [create, { loading, error, data }] = useCreateTimeRecord();
  const handleChange = useCallback(
    (fv) =>
      setFormState((c) => {
        return { ...c, ...fv };
      }),
    []
  );
  const handleSave = useCallback(() => {
    const { noteIn, noteOut, ...rest } = formState;
    const clockInDetails = { note: noteIn };
    const clockOutDetails = { note: noteOut };
    const input = { ...rest, clockInDetails, clockOutDetails };
    create({ variables: { input } });
  }, [create, formState]);

  useEffect(() => {
    onSaving(loading);
  }, [loading, onSaving]);

  useEffect(() => {
    if (!loading && !error && data && data.createTimeRec) onClose();
  }, [data, error, loading, onClose]);

  return (
    <TimeRecordForm
      {...formState}
      onChange={handleChange}
      onSave={handleSave}
      onClose={onClose}
      open={open}
      saving={loading}
    />
  );
};
CreateRecord.propTypes = {
  initialState: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaving: PropTypes.func.isRequired,
};
/**
 *
 * @param {*} props
 */
const UpdateRecord = (props) => {
  const { initialState, open, onClose, onSaving } = props;
  const [formState, setFormState] = useState({ ...initialState });
  const [update, { loading, error, data }] = useUpdateTimeRecord();
  const handleChange = useCallback(
    (fv) =>
      setFormState((c) => {
        return { ...c, ...fv };
      }),
    []
  );
  const handleSave = useCallback(() => {
    const { noteIn, noteOut, ...rest } = formState;
    const clockInDetails = { note: noteIn };
    const clockOutDetails = { note: noteOut };
    const input = { ...rest, clockInDetails, clockOutDetails };
    update({ variables: { input } });
  }, [update, formState]);

  useEffect(() => {
    onSaving(loading);
  }, [loading, onSaving]);

  useEffect(() => {
    if (!loading && !error && data && data.updateTimeRec) onClose();
  }, [data, error, loading, onClose]);

  return (
    <TimeRecordForm
      {...formState}
      onChange={handleChange}
      onSave={handleSave}
      onClose={onClose}
      open={open}
      saving={loading}
    />
  );
};
UpdateRecord.propTypes = {
  initialState: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaving: PropTypes.func.isRequired,
};

/**
 *
 * @param {*} props
 */
const TimeRecordForm = (props) => {
  const classes = useStyles();
  const {
    id,
    employeeId,
    timestampIn,
    timestampOut,
    noteIn,
    noteOut,
    onChange,
    onSave,
    onClose,
    open,
    saving,
  } = props;

  const handleEmployeeIdChange = useCallback(
    (v) => onChange({ employeeId: v }),
    [onChange]
  );

  const handleTextChange = useCallback(
    ({ target: { name, value } }) => {
      onChange({
        [name]: name.includes("timestamp")
          ? dateTimeLocalToUnixTimestamp(value)
          : value,
      });
    },
    [onChange]
  );

  const handleSave = useCallback(() => onSave(), [onSave]);

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
          <Grid item xs={12}>
            {!id ? (
              <SingleEmployeeSelect
                onChange={handleEmployeeIdChange}
                employeeId={employeeId}
                classes={{ root: classes.selectRoot }}
              />
            ) : (
              <EmployeeName employeeId={employeeId} />
            )}
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
              name="noteOut"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={noteOut || ""}
              rows={3}
            />
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );

  const saveButton = React.useMemo(
    () => (
      <Button key="saveBtn" onClick={handleSave} color="secondary">
        Save
      </Button>
    ),
    [handleSave]
  );
  const closeBtn = React.useMemo(
    () => (
      <Button key="closeBtn" onClick={onClose} color="primary">
        Back
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

/**
 *
 * @param {*} props
 */
const TimeRecordEdit = (props) => {
  const { record, open, onClose, onSaving = () => {} } = props;
  const [{ user }] = useContext(Context);
  const { employeeId: eId } = user || {};
  const formState = getInitialState(record, eId);

  return !open || !formState.id ? (
    <CreateRecord
      initialState={formState}
      open={open}
      onClose={onClose}
      onSaving={onSaving}
    />
  ) : (
    <UpdateRecord
      initialState={formState}
      open={open}
      onClose={onClose}
      onSaving={onSaving}
    />
  );
};

TimeRecordEdit.propTypes = {
  record: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaving: PropTypes.func,
};

export default TimeRecordEdit;
