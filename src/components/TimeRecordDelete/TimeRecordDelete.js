import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { DialogTemplate } from "components/Dialogs/components";
import { useDeleteTimeRecord } from "hooks";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  deleteBtn: {
    color: "red",
  },
});

const Deleting = (props) => {
  const { record, onDelete, onError = () => {} } = props;
  const [rec] = useState(record);
  const [remove, { loading, error, data }] = useDeleteTimeRecord();

  useEffect(() => {
    if (!loading) {
      if (error) {
        onError(error);
      } else if (data) onDelete(data);
    }
  }, [data, error, loading, onDelete, onError]);

  useEffect(() => {
    const { id, employeeId, companyId, _version } = rec;
    remove({ variables: { input: { id, employeeId, companyId, _version } } });
  }, [rec, remove]);

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <CircularProgress />
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          Deleting, please wait...
        </Typography>
      </Grid>
    </Grid>
  );
};

const Confirm = (props) => {
  const classes = useStyles();
  const { onChoice } = props;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h5" color="textSecondary">
          Are you sure, this cannot be undone?
        </Typography>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
        item
      >
        <Grid item xs={12}>
          <Button
            onClick={() => onChoice(true)}
            color="secondary"
            variant="outlined"
            classes={{ outlinedSecondary: classes.deleteBtn }}
          >
            Yes, delete it
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => onChoice(false)}
            color="primary"
            variant="contained"
          >
            No, keep the record
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
/**
 *
 * @param {*} props
 * @returns
 */
const Error = (props) => {
  const { error } = props;
  console.warn(error);

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h5" color="textSecondary">
          An error occurred.
        </Typography>
      </Grid>
    </Grid>
  );
};

/**
 *
 * @param {*} props
 */
const TimeRecordDelete = (props) => {
  const { record, open, onClose } = props;
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
      setError(null);
    }
  }, [open]);

  const cancelBtn = React.useMemo(
    () => (
      <Button
        key="cancleBtn"
        onClick={onClose}
        color="secondary"
        variant="outlined"
      >
        Cancel
      </Button>
    ),
    [onClose]
  );

  const handleChoice = (choice) => {
    setConfirmed(choice);
    if (!choice) onClose();
  };

  const handleError = (e) => {
    setError(e);
  };

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title="Delete Time Record"
      dialogContent={
        !confirmed ? (
          <Confirm onChoice={handleChoice} />
        ) : !error ? (
          <Deleting record={record} onDelete={onClose} onError={handleError} />
        ) : (
          <Error error={error} />
        )
      }
      actions={[cancelBtn]}
    />
  );
};

TimeRecordDelete.propTypes = {
  record: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaving: PropTypes.func,
};

export default TimeRecordDelete;
