import React, { useEffect } from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { useResetPassword } from "hooks";

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
  const [reset, { loading, error, data }] = useResetPassword();

  console.log("Password reset", error, data);

  useEffect(() => {
    if (open && employeeId) reset({ variables: { employeeId } });
  }, [employeeId, open, reset]);

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
          OK
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
