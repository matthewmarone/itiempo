import React, { useState, useEffect, useContext } from "react";
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

// eslint-disable-next-line
const logger = new Logger("AddEmployee.js", "ERROR");

const useStyles = makeStyles(() => ({
  helperText: { textAlign: "right", marginRight: 0, marginLeft: 0 },
  visibile: {},
  hidden: { display: "none", visibility: "hidden" },
  error: { color: "#de0000" },
}));

const AddEmployee = (props) => {
  const { open, onClose } = props;
  const classes = useStyles();
  const [state, setState] = useState({});
  const [createEmployee, { loading, error }] = useCreateEmployee();
  const [{ user }] = useContext(Context);
  const { companyId, employeeId: primaryManagerId } = user || {};
  const {
    firstName = "",
    lastName = "",
    email = "",
    role = "Employee",
  } = state;

  useEffect(() => {
    if (open) {
      // Resets form onOpen
      setState({});
    }
  }, [open]);

  const validateAndSave = () => {
    const { role, ...rest } = state;
    createEmployee({
      variables: {
        input: { ...rest, roles: [role], companyId, primaryManagerId },
      },
    });
  };

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
    <Button
      key="add"
      onClick={validateAndSave}
      color="primary"
      disabled={loading}
    >
      {loading ? "Saving..." : "Add"}
    </Button>,
  ];

  const handleChange = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const dialogContent = (
    <form autoComplete="off" noValidate>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="First name"
            margin="dense"
            name="firstName"
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
            onChange={handleChange}
            required
            value={email}
            variant="outlined"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <FormControl variant="outlined" className={""} fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select"
              id="role-select"
              value={role}
              onChange={handleChange}
              label="Role"
              name="role"
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
            {/* {error} */}
            Error
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
