import React, { useEffect, useMemo, useState } from "react";
import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import { Image, Currency } from "components";
import { DialogTemplate } from "components/Dialogs/components";
import { default as TimeRecordEdit } from "../TimeRecordEdit";
import { default as TimeRecordDelete } from "../TimeRecordDelete";
import { default as DateLocal } from "../DateLocal";
import { getEarnings, getFormatedTime, getTimeDifference } from "helpers";
import { useDownloadImage } from "hooks";
import PropTypes from "prop-types";
import clsx from "clsx";

const useStyles = makeStyles({
  imageSize: { maxHeight: "175px" },
  deleteBtn: { backgroundColor: "red", color: "white" },
  noShow: { display: "none", visibility: "hidden" },
});

const scene = {
  details: "details",
  edit: "edit",
  delete: "delete",
};

/**
 *
 * @param {*} props
 */
const TimeRecord = (props) => {
  const classes = useStyles();
  const [currentScene, setCurrentScene] = useState(scene.details);
  const { open, record, onClose } = props;
  const {
    timestampIn,
    timestampOut,
    clockInDetails,
    clockOutDetails,
    rate,
  } = record;
  const {
    photo: photoIn,
    note: noteIn,
    ipAddress: ipAddressIn,
  } = clockInDetails;
  const { photo: photoOut, note: noteOut, ipAddress: ipAddressOut } =
    clockOutDetails || {};
  const [setClockInImageVars, { data: clockInImage }] = useDownloadImage();
  const [setClockOutImageVars, { data: clockOutImage }] = useDownloadImage();
  const { name: payName, amount, isHourly } = rate || {};

  const timeDifference = getTimeDifference(timestampIn, timestampOut);
  const formatedTotalTime = getFormatedTime(timeDifference);
  const earnings = getEarnings(timeDifference, amount);

  useEffect(() => {
    if (open) {
      setClockInImageVars({ key: photoIn });
      setClockOutImageVars({ key: photoOut });
      setCurrentScene(scene.details);
    }
  }, [photoIn, open, photoOut, setClockInImageVars, setClockOutImageVars]);

  const noImg = "/images/avatars/user-silhouette.svg";
  const [leftTxtProps, rightTxtProps] = useMemo(
    () => [
      {
        color: "textSecondary",
        variant: "h5",
        align: "right",
      },
      {
        color: "textPrimary",
        variant: "h5",
        align: "left",
      },
    ],
    []
  );
  const dialogContent = (
    <Grid container spacing={4}>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Date</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>
          <DateLocal epochSeconds={timestampIn} local="es" format="l" />
        </Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Time</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>
          <DateLocal epochSeconds={timestampIn} local="es" format="LT" />
          {`${timestampOut > 0 ? ` - ` : ``}`}
          <DateLocal epochSeconds={timestampOut} local="es" format="LT" />
        </Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Duration (MM:HH)</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>{formatedTotalTime}</Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Rate</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>
          {amount > 0 ? `${payName} - $${amount}` : `Unspecified - $0`}
        </Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6} className={clsx(isHourly || classes.noShow)}>
        <Typography {...leftTxtProps}>Earnings</Typography>
      </Grid>
      <Grid item xs={6} className={clsx(isHourly || classes.noShow)}>
        <Typography {...rightTxtProps}>
          <Currency amount={earnings} />
        </Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Photo In:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Image
          imgClass={classes.imageSize}
          src={photoIn ? clockInImage : noImg}
          alt="Clock in"
        />
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Photo Out:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Image
          imgClass={classes.imageSize}
          src={photoIn ? clockOutImage : noImg}
          alt="Clock out"
        />
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Clock In Note:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>{noteIn}</Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Clock Out Note:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>{noteOut}</Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Clock-in IP Address:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>{ipAddressIn}</Typography>
      </Grid>
      {/** Start Row  */}
      <Grid item xs={6}>
        <Typography {...leftTxtProps}>Clock-out IP Address:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography {...rightTxtProps}>{ipAddressOut}</Typography>
      </Grid>
    </Grid>
  );

  const deleteButton = React.useMemo(
    () => (
      <Button
        key="deleteBtn"
        onClick={() => setCurrentScene(scene.delete)}
        color="primary"
        variant="contained"
        classes={{ containedPrimary: classes.deleteBtn }}
      >
        Delete
      </Button>
    ),
    [classes.deleteBtn]
  );

  const editButton = React.useMemo(
    () => (
      <Button
        key="editBtn"
        onClick={() => setCurrentScene(scene.edit)}
        color="primary"
        variant="contained"
      >
        Edit
      </Button>
    ),
    []
  );
  const closeBtn = React.useMemo(
    () => (
      <Button
        key="closeBtn"
        onClick={onClose}
        color="secondary"
        variant="outlined"
      >
        Close
      </Button>
    ),
    [onClose]
  );
  const actions = [editButton, deleteButton, closeBtn];

  switch (currentScene) {
    case scene.delete:
      return <TimeRecordDelete record={record} open={open} onClose={onClose} />;
    case scene.edit:
      return (
        <TimeRecordEdit
          record={record}
          open={open}
          onClose={() => setCurrentScene(scene.details)}
        />
      );
    case scene.details:
    default:
      return (
        <DialogTemplate
          open={open}
          handleClose={onClose}
          title="Time Record Details"
          dialogContent={dialogContent}
          actions={actions}
        />
      );
  }
};

TimeRecord.propTypes = {
  record: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimeRecord;
