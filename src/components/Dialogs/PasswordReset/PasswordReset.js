import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { useResetPassword } from "hooks";
import { isValidPassword, createTemporaryPassword } from "helpers";
import { I18n } from "aws-amplify";

/**
 *
 * @param {*} props
 * @returns
 */
const Content = (props) => {
  const { saving, onSubmit, errorMessage, success, password, onChange, valid } =
    props;

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <TextField
            name="password"
            value={password}
            onChange={onChange}
            label={I18n.get("Temporary Password")}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            color={errorMessage?.length > 0 ? "error" : "primary"}
            variant="body1"
          >
            {errorMessage?.length > 0
              ? errorMessage
              : success
              ? `${I18n.get(
                  "Done! Employee has been emailed a temporary password"
                )} (${password}) ${I18n.get(
                  ", which they can use to login and set a new password."
                )}`
              : ""}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            disabled={!valid || saving || success}
            type="submit"
          >
            {!saving ? I18n.get("Email Temporary Password") : I18n.get("Sending...")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

/**
 *
 * @param {*} props
 */
const PasswordReset = (props) => {
  const { open, onClose, employeeId } = props;
  const [changePassword, { loading, error, data }] = useResetPassword();
  const [errorMessage, setErrorMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState(createTemporaryPassword());

  useEffect(() => {
    if (!loading && data?.resetPassword) {
      setSuccess(true);
      setErrorMessage(null);
    } else if (!loading && error) {
      setSuccess(false);
      setErrorMessage(I18n.get("Failed to reset password, please try again"));
    }
  }, [data, error, loading]);
  /**
   *
   * @param {*} errMsg
   */
  const clear = (errMsg) => {
    setErrorMessage(errMsg);
    setSuccess(false);
  };

  useEffect(() => {
    if (open) {
      clear();
      setPassword(createTemporaryPassword());
    }
  }, [open]);

  const handleSubmit = () => {
    changePassword({
      variables: { employeeId, temporaryPassword: password },
    });
  };

  const handleChange = ({ target: { value } }) => setPassword(value);

  const handleClose = () => {
    if (!loading) onClose();
  };
  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title={I18n.get("Password Reset")}
      dialogContent={
        <Content
          saving={loading}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          success={success}
          password={password}
          onChange={handleChange}
          valid={isValidPassword(password)}
        />
      }
      actions={[
        <Button
          key="close"
          color="secondary"
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          {I18n.get("Close")}
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
