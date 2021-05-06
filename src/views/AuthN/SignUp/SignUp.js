import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  TextField,
  Link,
  Typography,
  FormHelperText,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import { Auth, Logger } from "aws-amplify";
import { UIAuthState } from "AppAuthenticator";
import { AuthLayout } from "./../components";
// eslint-disable-next-line
const logger = new Logger("SignUp.js", "ERROR");

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
  policy: {
    presence: { allowEmpty: false, message: "is required" },
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
  policy: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  policyCheckbox: {
    marginLeft: "-14px",
  },
  signUpButton: {
    margin: theme.spacing(2, 0),
  },
}));

const SignUp = (props) => {
  const classes = useStyles();
  const { authData, onAuthStateChange } = props;
  const { email } = authData || {};

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
              ? true
              : undefined
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSignIn = () => {
    const {
      values: { email },
    } = formState;
    onAuthStateChange(UIAuthState.SignIn, { email });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    const {
      values: { email, password },
    } = formState;
    // Signup through AWS Cognito, and then sign in
    Auth.signUp(email.toLowerCase(), password)
      .then(() => {
        Auth.signIn(email.toLowerCase(), password).catch((e) =>
          logger.error(e)
        );
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
        onSubmit={handleSignUp}
        noValidate
        autoComplete="on"
      >
        <Typography className={classes.title} variant="h2">
          Create new account
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Use your email to create new account
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
        <div className={classes.policy}>
          <Checkbox
            checked={formState.values.policy || false}
            className={classes.policyCheckbox}
            color="primary"
            name="policy"
            onChange={handleChange}
          />
          <Typography
            className={classes.policyText}
            color="textSecondary"
            variant="body1"
          >
            I have read and agree to the{" "}
            <Link
              color="primary"
              component="a"
              underline="always"
              variant="h6"
              href="https://app.termly.io/document/privacy-policy/88234c62-28d5-4269-873f-e35902194e82"
              target="_blank"
            >
              Privacy Policy
            </Link>
            {", "}
            and{" "}
            <Link
              color="primary"
              component="a"
              underline="always"
              variant="h6"
              href="https://app.termly.io/document/terms-of-use-for-ios-app/bffa37e4-1385-4f95-9022-f33c29520be7"
              target="_blank"
            >
              Terms & Conditions
            </Link>
            .
          </Typography>
        </div>
        {hasError("policy") && (
          <FormHelperText error>{formState.errors.policy[0]}</FormHelperText>
        )}
        <Button
          className={classes.signUpButton}
          color="primary"
          disabled={!formState.isValid || authState.authorizing}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {!authState.authorizing ? (
            `Sign up now`
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
          Have an account?{" "}
          <Link component="a" variant="h5" onClick={handleSignIn}>
            Sign in
          </Link>
        </Typography>
      </form>
    </AuthLayout>
  );
};

SignUp.propTypes = {
  authData: PropTypes.object,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default SignUp;
