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
import { EmployeePayRateSelect, Currency } from "components";
import { default as SingleEmployeeSelect } from "../SingleEmployeeSelect";
import { default as EmployeeName } from "../EmployeeName";
import {
  getDateLocal,
  getFormatedTime,
  getTimeDifference,
  dateTimeLocalToUnixTimestamp,
  getEarnings,
  isValidPayRate,
} from "helpers";
import {
  useCreateTimeRecord,
  useUpdateTimeRecord,
  useGetEmployee,
} from "hooks";
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
    rate,
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
    rate,
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
  const [errorMsg, setErrorMsg] = useState(null);
  const [create, { loading, error, data }] = useCreateTimeRecord();
  const handleChange = useCallback(
    (fv) =>
      setFormState((c) => {
        return { ...c, ...fv };
      }),
    []
  );
  const handleSave = useCallback(() => {
    const { noteIn, noteOut, rate: r, ...rest } = formState;
    const rate = isValidPayRate(r)
      ? {
          name: r.name,
          amount: r.amount,
          isHourly: r.isHourly,
          isDefault: r.isDefault,
        }
      : null;
    const clockInDetails = { note: noteIn };
    const clockOutDetails = { note: noteOut };
    const input = { ...rest, rate, clockInDetails, clockOutDetails };
    create({ variables: { input } });
  }, [create, formState]);

  useEffect(() => {
    onSaving(loading);
  }, [loading, onSaving]);

  useEffect(() => {
    if (!loading && !error && data?.createTimeRec) onClose();
  }, [data, error, loading, onClose]);

  useEffect(() => {
    if (!loading && error) {
      setErrorMsg("An error occurred");
    }
  }, [error, loading]);

  return (
    <TimeRecordForm
      {...formState}
      onChange={handleChange}
      onSave={handleSave}
      onClose={onClose}
      open={open}
      saving={loading}
      error={errorMsg}
      singleNote
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
    const { noteIn, noteOut, rate: r, ...rest } = formState;
    const rate = isValidPayRate(r)
      ? {
          name: r.name,
          amount: r.amount,
          isHourly: r.isHourly,
          isDefault: r.isDefault,
        }
      : null;
    const clockInDetails = { note: noteIn };
    const clockOutDetails = { note: noteOut };
    const input = { ...rest, rate, clockInDetails, clockOutDetails };
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
    rate,
    onChange,
    onSave,
    onClose,
    open,
    saving,
    singleNote,
    error,
  } = props;
  const [setEId, { data }] = useGetEmployee(employeeId);
  const { getEmployee: { payRates } = {} } = data || {};

  useEffect(() => setEId(employeeId), [employeeId, setEId]);

  const handleEmployeeIdChange = useCallback(
    (v) => onChange({ employeeId: v, rate: null }),
    [onChange]
  );

  const handleRateChange = useCallback((v) => onChange({ rate: v }), [
    onChange,
  ]);

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
    valid,
    earnings,
  ] = React.useMemo(() => {
    const ti = timestampIn ? getDateLocal(timestampIn) : "";
    const to = timestampOut ? getDateLocal(timestampOut) : "";
    const v = (timestampIn && !timestampOut) || timestampIn < timestampOut;
    const timeDifference = getTimeDifference(timestampIn, timestampOut);
    return [
      ti,
      to,
      getFormatedTime(timeDifference),
      v,
      getEarnings(timeDifference, rate?.amount),
    ];
  }, [rate?.amount, timestampIn, timestampOut]);

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
              {formatedTotalTime} / <Currency amount={earnings} />
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            {!id ? (
              <SingleEmployeeSelect
                onChange={handleEmployeeIdChange}
                employeeId={employeeId}
                classes={{ root: classes.selectRoot }}
              />
            ) : (
              <EmployeeName employeeId={employeeId} />
            )}
            {!error ? (
              <React.Fragment />
            ) : (
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            )}
          </Grid>
          <Grid item sm={6} xs={12}>
            <EmployeePayRateSelect
              rate={rate}
              payRates={payRates}
              onChange={handleRateChange}
              classes={{ root: classes.selectRoot }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              required
              fullWidth
              type="datetime-local"
              label="Time In"
              name="timestampIn"
              error={!valid && !!timestampOut}
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
              error={!valid && !!timestampOut}
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={formatedTimeOut}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item sm={!singleNote ? 6 : 12} xs={12}>
            <TextField
              fullWidth
              multiline
              label={`${!singleNote ? `Clock In ` : ``}Note`}
              name="noteIn"
              onChange={handleTextChange}
              variant="outlined"
              margin="dense"
              value={noteIn || ""}
              rows={3}
            />
          </Grid>
          {singleNote || (
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                multiline
                label="Clock Out Note"
                name="noteOut"
                onChange={handleTextChange}
                variant="outlined"
                margin="dense"
                value={noteOut || ""}
                rows={3}
              />
            </Grid>
          )}
        </React.Fragment>
      )}
    </Grid>
  );

  const saveButton = React.useMemo(
    () => (
      <Button
        key="saveBtn"
        onClick={handleSave}
        color="primary"
        variant="contained"
        disabled={!valid}
      >
        Save
      </Button>
    ),
    [handleSave, valid]
  );
  const closeBtn = React.useMemo(
    () => (
      <Button
        key="closeBtn"
        onClick={onClose}
        color="secondary"
        variant="outlined"
      >
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

  return !open ? (
    <React.Fragment />
  ) : !formState.id ? (
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
