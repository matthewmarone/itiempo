import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { EmployeeProfile, EmployeeDetails, EmployeeSetup } from "./components";
import { Logger } from "aws-amplify";
import { useGetEmployee, useUpdateEmployee, useUpdateUserRole } from "hooks";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("User.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
}));

const Loading = (props) => "Loading...";

const Employee = (props) => {
  const classes = useStyles();

  const { match } = props;
  const { id: employeeId } = match && match.params ? match.params : {};

  const [setId, { loading, error, data }] = useGetEmployee(employeeId);
  const { getEmployee } = data || {};

  const [employeeState, setEmployeeState] = useState(getEmployee);
  const [updatedFields, setUpdatedFields] = useState({});

  const [updateEmployee] = useUpdateEmployee();
  const [updateRole] = useUpdateUserRole();

  useEffect(() => {
    // Query for new employee when id changes
    if (employeeId) setId(employeeId);
  }, [employeeId, setId]);

  useEffect(() => {
    if (getEmployee && !employeeState) {
      // Set the employee the 1st time
      setEmployeeState(getEmployee);
    } else if (getEmployee && employeeState) {
      const { id } = getEmployee;
      const { id: existingId } = employeeState;
      if (id !== existingId) {
        // Display new Employee
        setEmployeeState(getEmployee);
        setUpdatedFields({});
      } else {
        setEmployeeState(getEmployee);
      }
    } else if (!getEmployee && employeeState) {
      logger.warn(
        "Unimplemented case, there was probably an error updating the employee or usr navigated to non-existant employee page."
      );
    }
    // Else still loading or error on 1st load
  }, [employeeState, getEmployee]);

  /**
   *
   */
  const handleChange = useCallback((v) => {
    setUpdatedFields((prev) => {
      return { ...prev, ...v };
    });
  }, []);

  /**
   *
   */
  const update = useCallback(
    (currEmployee, updatedFields) => {
      const { id, _version, username, primaryManagerId, roles } = currEmployee;
      const { role, ...changes } = updatedFields;
      if (changes) {
        const variables = { input: { id, _version, ...changes } };
        updateEmployee({ variables });
      }
      if (role)
        updateRole({
          variables: {
            username,
            employeeId: id,
            managerIds: [primaryManagerId],
            roles: [role],
            previousRoles: roles,
            _version: !changes ? _version : _version + 1,
          },
        });
    },
    [updateEmployee, updateRole]
  );

  /**
   *
   */
  const handleSave = useCallback(() => {
    update(employeeState, updatedFields);
  }, [employeeState, update, updatedFields]);
  /**
   *
   */
  const handlePhotoSave = useCallback(
    (profilePhoto) => {
      update(employeeState, { profilePhoto });
    },
    [employeeState, update]
  );

  const employee = useMemo(() => {
    return { ...(employeeState || {}), ...updatedFields };
  }, [employeeState, updatedFields]);

  if (error) logger.error(error);
  return (
    <div className={classes.root}>
      {loading ? (
        <Loading />
      ) : (
        !employeeState || (
          <Grid container spacing={4}>
            <Grid container item xl={4} lg={4} md={6} xs={12} spacing={4}>
              <Grid item xs={12}>
                <EmployeeProfile
                  employee={employee}
                  onPhotoSave={handlePhotoSave}
                />
              </Grid>
              <Grid item xs={12}>
                <EmployeeSetup
                  employee={employee}
                  onChange={handleChange}
                  onSave={handleSave}
                />
              </Grid>
            </Grid>
            <Grid container item xl={8} lg={8} md={6} xs={12} spacing={4}>
              <Grid item xs={12}>
                <EmployeeDetails
                  employee={employee}
                  onChange={handleChange}
                  onSave={handleSave}
                />
              </Grid>
            </Grid>
          </Grid>
        )
      )}
    </div>
  );
};

Employee.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Employee;
