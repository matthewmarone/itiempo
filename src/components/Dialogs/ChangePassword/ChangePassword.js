import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { Auth } from "aws-amplify";
import { I18n } from "aws-amplify";

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
            label={I18n.get("Current Password")}
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            value={password}
            onChange={onChange}
            label={I18n.get("New Password")}
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="confirm"
            value={confirm}
            onChange={onChange}
            label={I18n.get("Confirm Password")}
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
              ? I18n.get("Your password has been changed.")
              : ""}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            disabled={!valid || saving}
            type="submit"
          >
            {!saving ? I18n.get("Change") : I18n.get("Saving")}
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
          clear(I18n.get("Incorrect password."));
        } else if (code === "NetworkError") {
          clear(
            I18n.get("You appear to be off-line, please check your Internet connection and try again.")
          );
        } else if (code === "LimitExceededException") {
          I18n.get(clear("Attempt limit exceeded, please try after some time."));
        } else {
          clear(I18n.get("An error occurred, please try again later."));
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
      title={I18n.get("Change Password")}
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
        <Button
          key="close"
          onClick={handleClose}
          color="secondary"
          variant="outlined"
        >
          {I18n.get("Close")}
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
