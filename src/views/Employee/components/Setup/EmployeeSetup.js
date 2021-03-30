import React, { useMemo, useState } from "react";
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
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Logger } from "aws-amplify";
import { AvatarMenuItem } from "components";
import { useListEmployeesByEmail } from "hooks";

// eslint-disable-next-line
const logger = new Logger("EmployeeSetup.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {},
}));

/**
 *
 * @param {*} props
 * @returns
 */
const PayRate = (props) => {
  const { name, amount, isHourly, isDefault, onDelete } = props;

  return (
    <List dense>
      <ListItem>
        <ListItemIcon>
          <IconButton
            edge="start"
            aria-label="delete"
            size="small"
            onClick={onDelete}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1">
              {`${name} Rate: ${amount}/${isHourly ? `hour` : `year`}`}
            </Typography>
          }
          secondary={isDefault ? "Default" : null}
        />
      </ListItem>
    </List>
  );
};

const initialPayRate = {
  name: "",
  isDefault: false,
  isHourly: true,
};
/**
 *
 * @param {*} props
 * @returns
 */
const PayRateForm = (props) => {
  const { onAdd } = props;
  const [formState, setFormState] = useState({ ...initialPayRate });
  const handleChange = (e) => {
    const {
      target: { name: k, type, value, checked },
    } = e;
    setFormState((curr) => {
      return { ...curr, [k]: type === "checkbox" ? checked : value };
    });
  };
  const handleAdd = () => {
    onAdd({ ...formState });
    setFormState({ ...initialPayRate });
  };
  const { name, amount, isHourly, isDefault } = formState;
  const valid = useMemo(() => name?.trim().length > 0 && amount >= 0.01, [
    amount,
    name,
  ]);
  return (
    <React.Fragment>
      <Grid item xs={8}>
        <TextField
          fullWidth
          label="New Rate Name"
          margin="dense"
          name="name"
          onChange={handleChange}
          value={name || ""}
          variant="outlined"
          type="text"
        />
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel
          label="Default"
          control={
            <Checkbox
              checked={isDefault ? true : false}
              onClick={handleChange}
              name="isDefault"
            />
          }
        />
      </Grid>
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
      <Grid item xs={12}>
        <Button
          size="small"
          color="secondary"
          onClick={handleAdd}
          disabled={!valid}
        >
          Add Pay Rate
        </Button>
      </Grid>
    </React.Fragment>
  );
};
/**
 *
 * @param {*} props
 * @returns
 */
const EmployeeSetup = (props) => {
  const classes = useStyles();
  const {
    className,
    employee,
    onChange,
    onSave,
    saving,
    disableRole,
    onPayRateChange,
    ...rest
  } = props;
  const { companyId } = employee;
  const { data } = useListEmployeesByEmail(companyId);
  const {
    listEmployeesByEmail: { items: employees = [] },
  } = data || { listEmployeesByEmail: {} };
  const { primaryManagerId, jobTitle, payRates, roles } = employee;
  const role = roles && roles[0] ? roles[0] : "Employee";

  const handleChange = ({ target: { name, value } }) => {
    const role = name === "role";
    onChange({ [role ? "roles" : name]: role ? [value] : value });
  };

  /**
   *
   */
  const handleAddPayRate = (rate) => {
    const existingR = Array.isArray(payRates) ? payRates : [];
    let newRates;
    if (
      rate.isDefault ||
      existingR.findIndex((v) => v.isDefault === true) === -1
    ) {
      // This is the new default or there isn't already a default
      newRates = [
        { ...rate, isDefault: true },
        ...existingR.map((r) => {
          return { ...r, isDefault: false };
        }),
      ];
    } else {
      newRates = [...existingR, { ...rate, isDefault: false }];
    }

    onPayRateChange(newRates);
  };

  /**
   *
   * @param {*} index
   */
  const handelPayRateDelete = (index) => {
    const newDefault = index === 0 ? 1 : 0;
    onPayRateChange(
      (payRates || []).reduce((ret, val, idx) => {
        if (idx !== index)
          ret[ret.length] = {
            ...val,
            isDefault: idx === newDefault ? true : val.isDefault,
          };
        return ret;
      }, [])
    );
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
                    disabled={disableRole}
                  >
                    <MenuItem value={"Owner"}>Owner</MenuItem>
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Manager"}>Manager</MenuItem>
                    <MenuItem value={"Employee"}>Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {employees?.find((e) => e.id === primaryManagerId) ? (
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
                ) : (
                  <span>Loading....</span>
                )}
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
              <Grid item xs={12}>
                <h5>Pay Rates:</h5>
                {(payRates || []).map((r, i) => (
                  <PayRate
                    key={i}
                    {...r}
                    onDelete={() => handelPayRateDelete(i)}
                  />
                ))}
              </Grid>
              <PayRateForm onAdd={handleAddPayRate} />
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
  onPayRateChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  disableRole: PropTypes.bool,
};

export default EmployeeSetup;
