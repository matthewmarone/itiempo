import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Context } from "Store";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { EmployeeProfile, EmployeeDetails, EmployeeSetup } from "./components";
import { Logger } from "aws-amplify";
import { useGetEmployee, useUpdateEmployee } from "hooks";
import { Loading } from "views";
import clsx from "clsx";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("Employee.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  loadingRoot: {
    height: "50%",
    paddingLeft: theme.spacing(0),
  },
  hidden: {
    display: "none",
    visibility: "hidden",
  },
}));
const EmployeeView = (props) => {
  const { employee } = props;
  const classes = useStyles();
  const [employeeState, setEmployeeState] = useState(employee);
  const [updatedFields, setUpdatedFields] = useState({});
  const [updateEmployee, { loading: updating, error }] = useUpdateEmployee();
  if (error) logger.warn(error);
  const [{ user }] = useContext(Context);
  const userEmplId = user?.employeeId || "nobody";
  const usrRoles = user?.roles || [];

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
            payRates: changes?.payRates?.map((v) => {
              return { ...v, __typename: undefined };
            }),
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

  const { managers } = employeeState;

  // Shows sensitive information only if the user is a Owner/Admin or the manager of the employee
  const showSensitive =
    usrRoles.findIndex((v) => v === "Owner" || v === "Admin") !== -1 ||
    (usrRoles.findIndex((v) => v === "Manager") !== -1 &&
      (managers || []).findIndex((v) => v === userEmplId) !== -1);

  const isCurrentEmployee = userEmplId === employee?.id;

  return (
    <Grid container spacing={4}>
      <Grid container item xl={4} lg={4} md={6} xs={12} spacing={4}>
        <Grid item xs={12}>
          <EmployeeProfile
            employee={employeeModal}
            onPhotoSave={handlePhotoSave}
          />
        </Grid>
        <Grid item xs={12} className={clsx(showSensitive || classes.hidden)}>
          <EmployeeSetup
            employee={employeeModal}
            onChange={handleChange}
            onSave={handleSave}
            saving={updating}
            disableRole={isCurrentEmployee}
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
    <div className={clsx(classes.root, !employee && classes.loadingRoot)}>
      {!employee ? <Loading /> : <EmployeeView employee={employee} />}
    </div>
  );
};

Employee.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Employee;
