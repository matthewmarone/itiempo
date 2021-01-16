import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Auth, Logger } from "aws-amplify";
import {
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from "@material-ui/core";
// eslint-disable-next-line
const logger = new Logger("RestPasswordForm.js", "ERROR");

const schema = {
  code: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  signInButton: {
    margin: theme.spacing(2, 0),
  },
}));

const ResetPasswordForm = (props) => {
  const classes = useStyles();
  const { username, onTryAgain } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const [authState, setAuthState] = useState({
    authError: null,
    authorizing: false,
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      const {
        values: { code, password },
      } = formState;
      Auth.forgotPasswordSubmit(username, code, password)
        .then(() => {
          Auth.signIn(username, password).catch((e) => {
            logger.error(e);
          });
        })
        .catch((authError) => setAuthState({ authError, authorizing: false }));
      // Remove previous AWS error message, if any, and
      // Set the state to authorizing (loading...)
      setAuthState({ authError: null, authorizing: true });
    },
    [formState, username]
  );

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  if (authState.authError) logger.warn(authState.authError);
  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <Typography className={classes.title} variant="h2">
        Password reset
      </Typography>
      <TextField
        className={classes.textField}
        error={hasError("code")}
        fullWidth
        helperText={hasError("code") ? formState.errors.code[0] : null}
        label="Reset Code"
        name="code"
        onChange={handleChange}
        type="text"
        value={formState.values.code || ""}
        variant="outlined"
        autoComplete="one-time-code"
      />
      <TextField
        className={classes.textField}
        error={hasError("password")}
        fullWidth
        helperText={hasError("password") ? formState.errors.password[0] : null}
        label="New Password"
        name="password"
        onChange={handleChange}
        type="password"
        value={formState.values.password || ""}
        variant="outlined"
        autoComplete="new-password"
      />
      <Button
        className={classes.signInButton}
        color="primary"
        disabled={!formState.isValid || authState.authorizing}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        {!authState.authorizing ? (
          `Save New Password`
        ) : (
          <CircularProgress color="secondary" size={28} />
        )}
      </Button>
      {!authState.authError || (
        <Typography color="error" variant="body2">
          {authState.authError.message}
        </Typography>
      )}
      <Typography color="textSecondary" variant="body1">
        Didn't receive reset code?{" "}
        <Link component="a" variant="h6" onClick={onTryAgain}>
          Try Again
        </Link>
      </Typography>
    </form>
  );
};

ResetPasswordForm.propTypes = {
  username: PropTypes.string.isRequired,
  onTryAgain: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
