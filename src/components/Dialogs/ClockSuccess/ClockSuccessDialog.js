import React, { useCallback } from "react";
import { Button, Typography } from "@material-ui/core";
import { DialogTemplate } from "../components";
import { CenterContent, CountUp } from "components";
import PropTypes from "prop-types";

const Content = (props) => {
  const { timestampIn, timestampOut } = props;
  return (
    <CenterContent>
      <Typography variant="body1" color="textSecondary">
        <CountUp fromInSecond={timestampIn} />
      </Typography>
    </CenterContent>
  );
};
Content.propTypes = { message: PropTypes.string };

/**
 *
 * @param {*} props
 */
const ClockSuccessDialog = (props) => {
  const { open, onClose, record } = props;

  const { timestampIn, timestampOut } = record || {};
  console.log("record", record);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <DialogTemplate
      open={open}
      handleClose={handleClose}
      title={`You're Clocked ${!timestampOut ? `In` : `Out`}`}
      dialogContent={
        <Content timestampIn={timestampIn} timestampOut={timestampOut} />
      }
      actions={[
        <Button key="close" onClick={handleClose} color="primary">
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
  record: PropTypes.object.isRequired,
};

export default ClockSuccessDialog;
