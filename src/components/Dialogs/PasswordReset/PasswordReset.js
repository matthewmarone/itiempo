import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";

const Content = (props) => {
  const { loading } = props;

  const text = loading
    ? "Emailing temporary password..."
    : "Done! Employee has been emaild a temporary password which they can use to login and then set a new password.";

  return (
    <div>
      {!loading || <CircularProgress />}
      <Typography variant="body1">{text}</Typography>
    </div>
  );
};

/**
 *
 * @param {*} props
 */
const PasswordReset = (props) => {
  const { open, onClose, employeeId } = props;
  const loading = true;
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title="Password Reset"
      dialogContent={<Content loading={loading} />}
      actions={[
        <Button key="close" autoFocus onClick={handleClose} disabled={loading}>
          Close
        </Button>,
      ]}
    />
  );
};

PasswordReset.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
};

export default PasswordReset;
