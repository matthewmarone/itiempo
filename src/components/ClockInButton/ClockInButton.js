import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { Button } from "@material-ui/core";
import { ClockinDialog } from "components";
import { CLOCK_IN_STATE, useClockedIn, useGetEmployee } from "hooks";

/**
 *
 * @param {*} props
 */
const ClockInButton = (props) => {
  const { className, employeeId } = props;
  const [open, setOpen] = useState(false);
  const [setEmployeeId, { data }] = useGetEmployee(employeeId);
  const { getEmployee: employee } = data || {};
  const [clockedIn, setEmployeeId2, latestRec] = useClockedIn(employeeId);

  useEffect(() => {
    setEmployeeId(employeeId);
    setEmployeeId2(employeeId);
  }, [employeeId, setEmployeeId, setEmployeeId2]);

  return (
    <React.Fragment>
      <Button
        className={className}
        color="primary"
        variant="contained"
        disabled={!employee || clockedIn === CLOCK_IN_STATE.UNKNOWN}
        startIcon={<AccessTimeIcon />}
        onClick={() => setOpen(true)}
      >
        {clockedIn !== CLOCK_IN_STATE.IN ? "Clock In" : "Clock Out"}
      </Button>
      {!employee || (
        <ClockinDialog
          isClockedIn={clockedIn === CLOCK_IN_STATE.IN}
          latestRecord={latestRec}
          employee={employee}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </React.Fragment>
  );
};
ClockInButton.propTypes = {
  className: PropTypes.string,
  employeeId: PropTypes.string,
};

export default ClockInButton;
