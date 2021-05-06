import React, { useCallback } from "react";
import { Button, Typography, Grid, CircularProgress } from "@material-ui/core";
import { DialogTemplate } from "../components";
import { CountUp, Verse } from "components";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { getCounterFromMiliSeconds } from "helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    height: "100%",
    width: "100%",
  },
  grid: {
    height: "100%",
    width: "100%",
  },
  content: {
    alignSelf: "center",
  },
}));

const td = (n) => {
  return `${n < 10 ? `0` : ``}${n}`;
};
/**
 *
 * @param {*} props
 * @returns
 */
const ShowTime = (props) => {
  const { seconds } = props;
  const { days: dd, hours: hh, minutes: mm } = getCounterFromMiliSeconds(
    seconds * 1000
  );

  return `${dd > 0 ? td(dd) + ":" : ""}${td(hh)}:${td(mm)}`;
};

const Content = (props) => {
  const classes = useStyles();
  const { timestampIn, timestampOut, employeeId } = props;
  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          {!timestampIn ? (
            <CircularProgress />
          ) : (
            <Typography variant="h4" color="primary">
              {!timestampOut ? (
                <CountUp fromInSecond={timestampIn} />
              ) : (
                <ShowTime seconds={timestampOut - timestampIn} />
              )}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Verse employeeId={employeeId} />
        </Grid>
      </Grid>
    </div>
  );
};
Content.propTypes = { message: PropTypes.string };

/**
 *
 * @param {*} props
 */
const ClockSuccessDialog = (props) => {
  const { open, onClose, record, employeeId } = props;

  const { timestampIn, timestampOut } = record || {};

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <DialogTemplate
      open={open}
      handleClose={handleClose}
      title={
        !record ? `Loading` : `You're Clocked ${!timestampOut ? `In` : `Out`}`
      }
      dialogContent={
        <Content
          timestampIn={timestampIn}
          timestampOut={timestampOut}
          employeeId={employeeId}
        />
      }
      actions={[
        <Button
          key="close"
          onClick={handleClose}
          color="secondary"
          variant="outlined"
        >
          Close
        </Button>,
      ]}
    />
  );
};

ClockSuccessDialog.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  record: PropTypes.object,
};

export default ClockSuccessDialog;
