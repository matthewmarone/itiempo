import React, { useEffect } from "react";
import { useGetEmployee } from "hooks";
import PropTypes from "prop-types";

/**
 *
 * @param {*} param0
 */
const EmployeeName = ({ employeeId }) => {
  const [setId, { data }] = useGetEmployee(employeeId);
  const { getEmployee: { firstName, lastName } = {} } = data || {};
  useEffect(() => {
    setId(employeeId);
  }, [employeeId, setId]);
  return <span>{`${firstName || ""} ${lastName || ""}`.trim()}</span>;
};

EmployeeName.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeName;
