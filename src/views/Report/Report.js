import React, { useState, useContext, useMemo } from "react";
import { Context } from "Store";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { TimeTableReport, TimeTableFilter } from "components";
import { getWorkWeek, formateDate } from "helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
}));

/**
 *
 * @param {*} props
 * @returns
 */
const Report = (props) => {
  const classes = useStyles();
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const [refreshHack, setRefreshHack] = useState(0);
  const initialReportFilter = React.useMemo(
    () => ({
      selectedEmployees: [],
      fromDate: formateDate(getWorkWeek().fromDate),
      toDate: formateDate(),
    }),
    []
  );
  const [filterState, setFilterState] = useState(initialReportFilter);

  const handleTimeTableFilterChange = React.useCallback((filter) => {
    setFilterState(filter);
    setRefreshHack((c) => c + 1);
  }, []);

  console.log("filterState", filterState);
  const { selectedEmployees, fromDate, toDate } = filterState;
  const employeeIds = useMemo(
    () => selectedEmployees.map(({ id }) => id),
    [selectedEmployees]
  );

  return (
    <div className={classes.root} id="reportRoot">
      <Grid container spacing={4} justify="center">
        <Grid item xs={12} md={5} xl={4}>
          <TimeTableFilter
            onFilterUpdate={handleTimeTableFilterChange}
            initialState={filterState}
          />
        </Grid>
        <Grid item xs>
          <TimeTableReport
            refreshHack={refreshHack}
            companyId={companyId}
            employeeIds={employeeIds}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Report;
