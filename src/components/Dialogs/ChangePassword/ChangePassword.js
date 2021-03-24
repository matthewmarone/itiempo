import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { Auth } from "aws-amplify";

/**
 *
 * @param {*} props
 * @returns
 */
const Content = (props) => {
  const {
    onChange,
    current,
    password,
    confirm,
    valid,
    onSubmit,
    saving,
    errorMessage,
    success,
  } = props;
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
            name="current"
            value={current}
            onChange={onChange}
            label="Current Password"
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            value={password}
            onChange={onChange}
            label="New Password"
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="confirm"
            value={confirm}
            onChange={onChange}
            label="Confirm Password"
            type="password"
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
              ? "Your password has been changed."
              : ""}
          </Typography>
          <Button color="secondary" disabled={!valid || saving} type="submit">
            {!saving ? "Change" : "Saving"}
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
const ChangePassword = (props) => {
  const { open, onClose } = props;
  const [formState, setFormState] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSucces] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const clear = (msg) => {
    setFormState({ current: "", password: "", confirm: "" });
    setSaving(false);
    setSucces(false);
    setErrMsg(msg);
  };

  useEffect(() => {
    if (open) {
      clear();
    }
  }, [open]);
  const handleChange = ({ target: { name, value } }) =>
    setFormState((curr) => {
      return { ...curr, [name]: value };
    });
  const handleSubmit = () => {
    setSaving(true);
    const { current, password } = formState;
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, current, password);
      })
      .then((data) => {
        clear();
        setSucces(true);
      })
      .catch((err) => {
        const { code } = err;
        if (code === "NotAuthorizedException") {
          clear("Incorrect password.");
        } else if (code === "NetworkError") {
          clear(
            "You appear to be off-line, please check your Internet connection and try again"
          );
        } else if (code === "LimitExceededException") {
          clear("Attempt limit exceeded, please try after some time.");
        } else {
          clear("An error occurred, please try again later.");
          console.error(err);
        }
      });
  };
  const handleClose = () => {
    onClose();
  };
  const { current, password, confirm } = formState;
  const valid =
    current?.length > 5 && password?.length > 5 && password === confirm;

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title="Change Password"
      dialogContent={
        <Content
          onChange={handleChange}
          current={current}
          password={password}
          confirm={confirm}
          onSubmit={handleSubmit}
          valid={valid}
          saving={saving}
          errorMessage={errMsg}
          success={success}
        />
      }
      actions={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
    />
  );
};

ChangePassword.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePassword;
