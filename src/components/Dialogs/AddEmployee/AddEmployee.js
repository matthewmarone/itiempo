import React, { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "Store";
import { DialogTemplate } from "../components";
import PropTypes from "prop-types";
import { Logger } from "aws-amplify";
import {
  Grid,
  Button,
  TextField,
  FormHelperText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/styles";
import { useCreateEmployee } from "hooks";
import validate from "validate.js";

// eslint-disable-next-line
const logger = new Logger("AddEmployee.js", "ERROR");

const useStyles = makeStyles(() => ({
  helperText: { textAlign: "right", marginRight: 0, marginLeft: 0 },
  visibile: {},
  hidden: { display: "none", visibility: "hidden" },
  error: { color: "#de0000" },
}));
// Form schema
const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  lastName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  role: {
    presence: { allowEmpty: false, message: "is required" },
  },
};
/**
 *
 * @param {*} props
 */
const MySaveBtn = (props) => {
  const { input, onError, onData } = props;
  const [createEmployee, { loading, error, data }] = useCreateEmployee();
  useEffect(() => {
    if (input)
      createEmployee({
        variables: {
          input,
        },
      });
  }, [createEmployee, input]);

  useEffect(() => {
    if (!loading) {
      if (error) {
        onError(error);
      } else if (data) {
        onData(data);
      }
    }
  }, [data, error, loading, onData, onError]);

  return (
    <Button color="primary" disabled>
      Saving...
    </Button>
  );
};

/**
 *
 * @param {*} props
 */
const AddEmployee = (props) => {
  const { open, onClose } = props;
  const classes = useStyles();
  const [input, setInput] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });
  const [{ user }] = useContext(Context);
  const { companyId, employeeId: primaryManagerId } = user || {};
  const {
    firstName = "",
    lastName = "",
    email = "",
    role = "",
  } = formState.values;

  const reset = useCallback(() => {
    setFormState({
      isValid: false,
      values: {},
      touched: {},
      errors: {},
    });
    setInput(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

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

  const handleSave = () => {
    const { role, ...rest } = formState.values;
    setLoading(true);
    setError(null);
    setInput({ ...rest, roles: [role], companyId, primaryManagerId });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleOnError = useCallback((e) => {
    setLoading(false);
    setError(e);
  }, []);
  const handleOnData = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const actions = [
    <Button
      className={loading ? classes.hidden : classes.visibile}
      key="cancel"
      onClick={onClose}
      color="primary"
      disabled={loading}
    >
      Cancel
    </Button>,
    !loading ? (
      <Button
        key="add"
        onClick={handleSave}
        color="primary"
        disabled={!formState.isValid}
      >Add</Button>
    ) : (
      <MySaveBtn
        key="add"
        input={input}
        onError={handleOnError}
        onData={handleOnData}
      />
    ),
  ];

  if (error) console.log("error", error);

  const dialogContent = (
    <form autoComplete="off" noValidate>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="First name"
            margin="dense"
            name="firstName"
            helperText={
              hasError("firstName") ? formState.errors.firstName[0] : null
            }
            onChange={handleChange}
            required
            value={firstName}
            variant="outlined"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Last name"
            margin="dense"
            name="lastName"
            helperText={
              hasError("lastName") ? formState.errors.lastName[0] : null
            }
            onChange={handleChange}
            required
            value={lastName}
            variant="outlined"
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            margin="dense"
            name="email"
            helperText={hasError("email") ? formState.errors.email[0] : null}
            onChange={handleChange}
            required
            value={email}
            variant="outlined"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <FormControl variant="outlined" className={""} required fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select"
              id="role-select"
              value={role}
              onChange={handleChange}
              label="Role"
              name="role"
              helperText={hasError("role") ? formState.errors.role[0] : null}
            >
              <MenuItem value={"Owner"}>Owner</MenuItem>
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Manager"}>Manager</MenuItem>
              <MenuItem value={"Employee"}>Employee</MenuItem>
            </Select>
            <Tooltip
              disableFocusListener
              title={
                <React.Fragment>
                  <p>Sets the level of access each employee will have.</p>
                  <br />
                  <ul>
                    <li>Owner - Full access</li>
                    <li>
                      Admin - Like owner, except can't see payment info or
                      remove Owner accesses
                    </li>
                    <li>
                      Manager - Can see and setup their own employees, and make
                      employees managers
                    </li>
                    <li>Employee - Can only view their own information</li>
                  </ul>
                </React.Fragment>
              }
              placement="top"
            >
              <FormHelperText
                id="role-select-helper-text"
                classes={{
                  root: classes.helperText,
                }}
              >
                What's This?
              </FormHelperText>
            </Tooltip>
          </FormControl>
        </Grid>
        <Grid item xs={12} className={error ? classes.error : classes.hidden}>
          <Typography
            className={error ? classes.error : classes.hidden}
            variant="body1"
          >
            {!error || error.message === "Account already exists"
              ? "Account already exists, please use a different email."
              : error.message === "Employee already exists"
              ? "Employee already exists, please ask your admin to make you their manager."
              : "Oh no, something went wrong"}
          </Typography>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <DialogTemplate
      open={open}
      handleClose={() => {
        onClose();
      }}
      title="New Employee"
      dialogContent={dialogContent}
      actions={actions}
    />
  );
};

AddEmployee.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddEmployee;
