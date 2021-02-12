import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { EmployeeProfile, EmployeeDetails, EmployeeSetup } from "./components";
import { Logger } from "aws-amplify";
import { useGetEmployee, useUpdateEmployee } from "hooks";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("Employee.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
}));
/**
 *
 * @param {*} props
 */
const LoadingView = (props) => "Loading...";

const EmployeeView = (props) => {
  const { employee } = props;
  const [employeeState, setEmployeeState] = useState(employee);
  const [updatedFields, setUpdatedFields] = useState({});
  const [updateEmployee, { loading: updating, error }] = useUpdateEmployee();
  if (error) logger.warn(error);

  /**
   *
   */
  useEffect(() => {
    setEmployeeState((preEmpl) => {
      if (preEmpl.id !== employee.id) setUpdatedFields({});
      return employee;
    });
  }, [employee]);

  /**
   *
   */
  const handleChange = useCallback((v) => {
    setUpdatedFields((prev) => {
      return { ...prev, ...v };
    });
  }, []);

  /**
   * Called by handleSave or handlePhotoSave
   */
  const update = useCallback(
    (currEmployee, updatedFields) => {
      const { roles: updateRoles, ...changes } = updatedFields;
      if (changes) {
        const variables = {
          input: {
            ...currEmployee,
            ...changes,
            updateRoles,
            __typename: undefined,
          },
        };
        updateEmployee({ variables });
      }
    },
    [updateEmployee]
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

  // The employee data to render
  const employeeModal = useMemo(() => {
    return { ...employeeState, ...updatedFields };
  }, [employeeState, updatedFields]);

  return (
    <Grid container spacing={4}>
      <Grid container item xl={4} lg={4} md={6} xs={12} spacing={4}>
        <Grid item xs={12}>
          <EmployeeProfile
            employee={employeeModal}
            onPhotoSave={handlePhotoSave}
          />
        </Grid>
        <Grid item xs={12}>
          <EmployeeSetup
            employee={employeeModal}
            onChange={handleChange}
            onSave={handleSave}
            saving={updating}
          />
        </Grid>
      </Grid>
      <Grid container item xl={8} lg={8} md={6} xs={12} spacing={4}>
        <Grid item xs={12}>
          <EmployeeDetails
            employee={employeeModal}
            onChange={handleChange}
            onSave={handleSave}
            saving={updating}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
EmployeeView.propTypes = {
  employee: PropTypes.object.isRequired,
};

/**
 *
 * @param {*} props
 */
const Employee = (props) => {
  const classes = useStyles();
  const { match: { params: { id: employeeId } = {} } = {} } = props;
  const [setId, { error, data }] = useGetEmployee(employeeId);
  if (error) logger.warn(error);
  const { getEmployee: employee } = data || {};

  useEffect(() => {
    if (employeeId) setId(employeeId);
  }, [employeeId, setId]);

  return (
    <div className={classes.root}>
      {!employee ? <LoadingView /> : <EmployeeView employee={employee} />}
    </div>
  );
};

Employee.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Employee;
