import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  TextField,
  Grid,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Chip,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  // Typography,
  CircularProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Logger } from "aws-amplify";
import { AvatarMenuItem } from "components";
import { useListEmployeesByEmail } from "hooks";

// eslint-disable-next-line
const logger = new Logger("UserJobProfile.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const PayRate = (props) => {
  const { name, amount, isHourly = true, isDefault = false, onChange } = props;
  const handleChange = (e) => {
    if (typeof onChange === "function") {
      const {
        target: { name: k, type, value, checked },
      } = e;
      onChange({
        name,
        amount,
        isHourly,
        isDefault,
        [k]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <React.Fragment>
      <Grid item xs>
        <TextField
          fullWidth
          label={
            isHourly || isHourly === null || isHourly === undefined
              ? "Hourly Rate"
              : "Annual Salary"
          }
          margin="dense"
          name="amount"
          onChange={handleChange}
          value={amount || ""}
          variant="outlined"
          type="number"
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel
          label="Paid hourly"
          control={
            <Checkbox
              checked={
                isHourly || isHourly === null || isHourly === undefined
                  ? true
                  : false
              }
              onClick={handleChange}
              name="isHourly"
            />
          }
        />
      </Grid>
    </React.Fragment>
  );
};

const EmployeeSetup = (props) => {
  const classes = useStyles();
  const { className, employee, onChange, onSave, saving, ...rest } = props;
  const { companyId } = employee;
  const { data } = useListEmployeesByEmail(companyId);
  const {
    listEmployeesByEmail: { items: employees = [] },
  } = data || { listEmployeesByEmail: {} };
  const {
    primaryManagerId,
    jobTitle,
    payRates = [],
    roles,
    role: r, // Role is not a real employee field
  } = employee;
  const role = r || (roles && roles[0] ? roles[0] : "Employee");

  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  const validRate = (rate) => {
    const { amount, isHourly = true, isDefault = false } = rate;
    return {
      ...rate,
      amount: amount > 0 ? amount : 0,
      isHourly: isHourly !== null ? isHourly : true,
      isDefault: isDefault !== null ? isDefault : false,
    };
  };

  const handlePayRateChange = (rate, idx) => {
    const newRates =
      payRates && payRates.length > 0
        ? payRates.map((v, i) => (i === idx ? validRate(rate) : v))
        : [validRate(rate)];
    onChange({ payRates: newRates });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate>
        <CardHeader
          subheader="The information can be edited"
          title="Employee Setup"
        />
        <Divider />
        <CardContent>
          <div className={classes.details}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={role || ""}
                    onChange={handleChange}
                    label="Role"
                    name="role"
                  >
                    <MenuItem value={"Owner"}>Owner</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Manager"}>Manager</MenuItem>
                    <MenuItem value={"Employee"}>Employee</MenuItem>
                  </Select>
                </FormControl>
                {/* <Typography
                  className={classes.locationText}
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Saving role...
                </Typography> */}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="select-employee-supervisor"
                  disableClearable
                  options={employees}
                  value={
                    primaryManagerId
                      ? employees.find((e) => e.id === primaryManagerId)
                      : null
                  }
                  onChange={(event, value, reason) => {
                    if (value) onChange({ primaryManagerId: value.id });
                  }}
                  getOptionLabel={(option) =>
                    option.firstName + " " + option.lastName
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.firstName + " " + option.lastName}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, { selected }) => (
                    <AvatarMenuItem {...option} isSelected={selected} />
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee Supervisor"
                      variant="outlined"
                      placeholder="Select supervisor"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  margin="dense"
                  name="jobTitle"
                  onChange={handleChange}
                  value={jobTitle || ""}
                  variant="outlined"
                />
              </Grid>
              {payRates && payRates.length > 0 ? (
                payRates.map((v, i) => (
                  <PayRate
                    key={i}
                    {...v}
                    onChange={(v) => handlePayRateChange(v, i)}
                  />
                ))
              ) : (
                <PayRate
                  key={0}
                  isDefault={true}
                  onChange={(v) => handlePayRateChange(v, 0)}
                />
              )}
            </Grid>
          </div>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={onSave}
            disabled={saving}
          >
            {!saving ? (
              "Save details"
            ) : (
              <CircularProgress color="secondary" size={28} />
            )}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

EmployeeSetup.propTypes = {
  className: PropTypes.string,
  employee: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default EmployeeSetup;
