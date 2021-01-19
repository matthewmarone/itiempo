import React, { useState, useEffect, useContext } from "react";
import { Context } from "Store";
import { AppActions } from "Reducer";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { UIAuthState } from "AppAuthenticator";
import { Logger } from "aws-amplify";
import { AuthLayout } from "./../components";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { parseFullName } from "helpers";
import { gql, useMutation } from "@apollo/client";
import {
  setupNewAccount as setupNewAccountGQL,
  updateEmployee as updateEmployeeGQL,
} from "graphql/mutations";
// eslint-disable-next-line
const logger = new Logger("WelcomeNewAccount.js", "ERROR");

// Form validation schema
const schema = {
  yourName: {
    presence: { allowEmpty: false, message: "(first & last) is required" },
    length: {
      maximum: 64,
    },
  },
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
    },
  },
  lastName: {
    presence: { allowEmpty: false, message: "is required" },
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

/**
 *
 * @param {*} props
 */
const WelcomeNewAccount = (props) => {
  const classes = useStyles();
  const [{ userLocalAppData }, dispatch] = useContext(Context);
  const [name, setName] = useState();
  const [
    createAccount,
    {
      data: dataAcct,
      loading: loadingAcct,
      error: errorAcct,
      called: calledAcct,
    },
  ] = useMutation(gql(setupNewAccountGQL));
  const [
    updateEmployee,
    {
      data: dataEmpl,
      loading: loadingEmpl,
      error: errorEmpl,
      called: calledEmpl,
    },
  ] = useMutation(gql(updateEmployeeGQL));
  const { onAuthStateChange } = props;
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  // Setup account on load
  useEffect(() => {
    if (!calledAcct) createAccount();
  }, [calledAcct, createAccount]);
  
  // Update employee after account setup, and name form is submitted
  useEffect(() => {
    if (calledAcct && !loadingAcct && !errorAcct && dataAcct && name) {
      logger.debug("dataAcct", dataAcct);
      const {
        setupNewAccount: { id },
      } = dataAcct || { setupNewAccount: {} };
      if (id) {
        const { firstName, lastName } = name;
        updateEmployee({
          variables: { input: { id, firstName, lastName } },
        });
      }
    }
  }, [calledAcct, dataAcct, errorAcct, loadingAcct, name, updateEmployee]);

  // Runs after successfull employee update response
  // We dispatch to the context the fact that the account has been setup
  // The reducer also stores this in localstorage
  useEffect(() => {
    if (calledEmpl && !errorEmpl && !loadingEmpl && dataEmpl) {
      logger.debug("dataEmpl", dataEmpl);
      dispatch({
        type: AppActions.UPDATE_LOCAL_APP_DATA,
        payload: { accountSetup: true },
      });
    }
  }, [calledEmpl, dataEmpl, dispatch, errorEmpl, loadingEmpl]);

  // Hook fires when the app context is updated
  useEffect(() => {
    if (userLocalAppData.accountSetup) onAuthStateChange(UIAuthState.SignedIn);
  }, [onAuthStateChange, userLocalAppData.accountSetup]);

  // Checks for errors on from change
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  // To show error message if user leaves form without providing name
  const handleNameBlur = (event) => {
    event.persist();
    setFormState((formState) => {
      return {
        ...formState,
        touched: {
          ...formState.touched,
          yourName: true,
          firstName: true,
          lastName: true,
        },
      };
    });
  };

  const handleNameChange = (event) => {
    event.persist();
    const yourName = event.target.value;
    const { firstName, lastName } = parseFullName(yourName);
    setFormState((formState) => {
      return {
        ...formState,
        values: {
          yourName,
          firstName,
          lastName,
        },
        touched: {
          ...formState.touched,
          yourName: true,
          firstName: true,
          lastName: formState.touched.lastName || !!lastName,
        },
      };
    });
  };

  const handleSetupAccount = (event) => {
    event.preventDefault();
    const {
      values: { firstName, lastName },
    } = formState;
    setName({ firstName, lastName });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  if (errorAcct) logger.warn(errorAcct);
  if (errorEmpl) logger.warn(errorEmpl);

  return (
    <AuthLayout>
      <form
        className={classes.form}
        onSubmit={handleSetupAccount}
        noValidate
        autoComplete="on"
      >
        <Typography className={classes.title} variant="h2">
          Account created
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Tell us your name to get started
        </Typography>
        <TextField
          autoFocus
          className={classes.textField}
          error={hasError("lastName") || hasError("yourName")}
          fullWidth
          helperText={
            hasError("yourName")
              ? formState.errors.yourName[0]
              : hasError("lastName")
              ? formState.errors.lastName[0]
              : null
          }
          label="Your Name"
          name="yourName"
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          type="text"
          value={formState.values.yourName || ""}
          variant="outlined"
          autoComplete="name"
        />
        <Button
          className={classes.signInButton}
          color="primary"
          disabled={!formState.isValid}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          {!(name && (loadingAcct || loadingEmpl)) ? (
            `Let's Go!`
          ) : (
            <CircularProgress color="secondary" size={28} />
          )}
        </Button>
        {!(errorAcct && name) || (
          <Typography color="error" variant="body2">
            Could not setup account at this time.
          </Typography>
        )}
      </form>
    </AuthLayout>
  );
};

WelcomeNewAccount.propTypes = {
  authData: PropTypes.object,
  onAuthStateChange: PropTypes.func.isRequired,
};

export default WelcomeNewAccount;
