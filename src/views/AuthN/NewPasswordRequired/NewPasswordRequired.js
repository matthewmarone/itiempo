import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Auth } from "aws-amplify";
import { AuthLayout } from "./../components";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";

const schema = {
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

const NewPasswordRequired = (props) => {
  const classes = useStyles();
  const { authData } = props;
  const { user } = authData || {};

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

  const handleNewPassword = (event) => {
    event.preventDefault();
    const {
      values: { password },
    } = formState;
    // Set's new password and user auto logged inS
    Auth.completeNewPassword(user, password).catch((authError) =>
      setAuthState({ authError, authorizing: false })
    );
    // Remove previous AWS error message, if any, and
    // Set the state to authorizing (loading...)
    setAuthState({ authError: null, authorizing: true });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  if (authState.authError) console.warn(authState.authError);
  return (
    <AuthLayout>
      <form
        className={classes.form}
        onSubmit={handleNewPassword}
        noValidate
        autoComplete="off"
      >
        <Typography className={classes.title} variant="h2">
          New Password
        </Typography>
        <TextField
          className={classes.textField}
          error={hasError("password")}
          fullWidth
          helperText={
            hasError("password") ? formState.errors.password[0] : null
          }
          label="Password"
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
            `Set Password`
          ) : (
            <CircularProgress color="secondary" size={28} />
          )}
        </Button>
        {!authState.authError || (
          <Typography color="error" variant="body1">
            {authState.authError.message}
          </Typography>
        )}
      </form>
    </AuthLayout>
  );
};

NewPasswordRequired.propTypes = {
  authData: PropTypes.object,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default NewPasswordRequired;
