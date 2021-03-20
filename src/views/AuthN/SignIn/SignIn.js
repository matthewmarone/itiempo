import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { UIAuthState } from "AppAuthenticator";
import { Auth, Logger } from "aws-amplify";
import { AuthLayout } from "./../components";
import { PinClockInDialog } from "components";
import {
  Button,
  TextField,
  Link,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useQuickClockIn } from "hooks";
// eslint-disable-next-line
const logger = new Logger("SignIn.js", "ERROR");

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
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

const cachedPins = () => {
  const retVal = JSON.parse(localStorage.getItem("itiempo.qc") || "[]");
  if (!Array.isArray(retVal)) {
    console.error("Expected array for localStorage key 'itiempo.qc'");
    return [];
  }
  return retVal;
};

const SignIn = (props) => {
  const classes = useStyles();
  const { authData, onAuthStateChange } = props;
  const { email } = authData || {};
  const [openQuickClock, setOpenQuickClock] = useState(false);
  const [pinRecords, setPinRecords] = useState(cachedPins);
  const [companyIds] = useState(JSON.parse(localStorage.getItem("itiempo.ac")));
  const [queryCompany, { error, data }] = useQuickClockIn();
  if (error) console.warn(error);
  useEffect(() => {
    if (Array.isArray(companyIds) && companyIds.length > 0) {
      queryCompany({ companyId: companyIds[0] });
    }
  }, [companyIds, queryCompany]);

  useEffect(() => {
    if (data?.quickClockIn) {
      const quickClockIn = JSON.parse(data.quickClockIn);
      try {
        if (Array.isArray(quickClockIn?.items)) {
          setPinRecords(quickClockIn.items);
          localStorage.setItem(
            "itiempo.qc",
            JSON.stringify(quickClockIn.items)
          );
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }, [data]);

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

  const handleSignUp = () => {
    const {
      values: { email },
    } = formState;
    onAuthStateChange(UIAuthState.SignUp, { email });
  };

  const handleForgotPassword = () => {
    const {
      values: { email },
    } = formState;
    onAuthStateChange(UIAuthState.ForgotPassword, { email });
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    const {
      values: { email, password },
    } = formState;
    // Signin to AWS
    Auth.signIn(email.toLowerCase(), password)
      .then((user) => {
        if (user.challengeName === "NEW_PASSWORD_REQUIRED")
          onAuthStateChange(UIAuthState.NewPasswordRequired, { user });
      })
      .catch((authError) => setAuthState({ authError, authorizing: false }));
    // Remove previous AWS error message, if any, and
    // Set the state to authorizing (loading...)
    setAuthState({ authError: null, authorizing: true });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  if (authState.authError) logger.warn(authState.authError);
  return (
    <AuthLayout>
      <form
        className={classes.form}
        onSubmit={handleSignIn}
        noValidate
        autoComplete="on"
      >
        <Typography className={classes.title} variant="h2">
          Sign in
        </Typography>
        <TextField
          autoFocus
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
          autoComplete="current-password"
        />
        <Typography color="textSecondary" variant="body2">
          Forgot your password?{" "}
          <Link component="a" variant="body2" onClick={handleForgotPassword}>
            Reset password
          </Link>
        </Typography>
        {!authState.authError || (
          <Typography color="error" variant="body2">
            {authState.authError.message}
          </Typography>
        )}
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
            `Sign in now`
          ) : (
            <CircularProgress color="secondary" size={28} />
          )}
        </Button>
        {!(Array.isArray(companyIds) && companyIds.length > 0) || (
          <Button
            className={classes.signInButton}
            color="secondary"
            disabled={authState.authorizing}
            fullWidth
            size="large"
            variant="contained"
            onClick={() => setOpenQuickClock(true)}
          >
            Quick Clock In/Out
          </Button>
        )}
        <Typography color="textSecondary" variant="body1">
          Don't have an account?{" "}
          <Link component="a" variant="h6" onClick={handleSignUp}>
            Sign up
          </Link>
        </Typography>
      </form>
      <PinClockInDialog
        open={openQuickClock}
        pinRecords={pinRecords}
        onClose={() => setOpenQuickClock(false)}
      />
    </AuthLayout>
  );
};

SignIn.propTypes = {
  authData: PropTypes.object,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default SignIn;
