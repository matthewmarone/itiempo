import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { UIAuthState } from "AppAuthenticator";
import { Auth } from "aws-amplify";
import {
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from "@material-ui/core";

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
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

const SendRestEmailForm = (props) => {
  const classes = useStyles();
  const { onSentEmail, onAuthStateChange, email } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: { email },
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
    // TODO (Matthew): Handle network timeout
    (event) => {
      event.preventDefault();
      const {
        values: { email: e },
      } = formState;
      const email = e.toLowerCase();
      Auth.forgotPassword(email)
        .then(() => onSentEmail(email))
        .catch((authError) => setAuthState({ authError, authorizing: false }));
      // Remove previous AWS error message, if any, and
      // Set the state to authorizing (loading...)
      setAuthState({ authError: null, authorizing: true });
    },
    [formState, onSentEmail]
  );

  const handleSignIn = () => {
    const {
      values: { email },
    } = formState;
    onAuthStateChange(UIAuthState.SignIn, { email });
  };

  const handleSignUp = () => {
    const {
      values: { email },
    } = formState;
    onAuthStateChange(UIAuthState.SignUp, { email });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  if (authState.authError) console.warn(authState.authError);
  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="on"
    >
      <Typography className={classes.title} variant="h2">
        Password reset
      </Typography>
      <TextField
        className={classes.textField}
        error={hasError("email")}
        fullWidth
        helperText={hasError("email") ? formState.errors.email[0] : null}
        label="Email address"
        name="email"
        onChange={handleChange}
        type="text"
        value={formState.values.email || ""}
        variant="outlined"
        autoComplete="email"
      />

      <Typography color="textSecondary" variant="body1">
        Remember your password?{" "}
        <Link component="a" variant="body1" onClick={handleSignIn}>
          Sign In
        </Link>
      </Typography>
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
          `Email Reset Password`
        ) : (
          <CircularProgress color="secondary" size={28} />
        )}
      </Button>
      {!authState.authError || (
        <Typography color="error" variant="body1">
          {authState.authError.message}
        </Typography>
      )}
      <Typography color="textSecondary" variant="body1">
        Don't have an account?{" "}
        <Link component="a" variant="h5" onClick={handleSignUp}>
          Sign up
        </Link>
      </Typography>
    </form>
  );
};

SendRestEmailForm.propTypes = {
  email: PropTypes.string,
  onSentEmail: PropTypes.func.isRequired,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default SendRestEmailForm;
