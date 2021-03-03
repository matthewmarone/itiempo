import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  makeStyles,
  CircularProgress,
  Collapse,
  Box,
} from "@material-ui/core";
import { DateLocal, TimeRecord } from "components";
import PropTypes from "prop-types";
import { Logger } from "aws-amplify";
import { Edit as EditIcon } from "@material-ui/icons";
import {
  getFormatedTime,
  getTimeDifference,
  dateToUnixTimestamp,
  SECONDS_IN_DAY,
} from "helpers";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  useListEmployeeTimeRecord,
  useListCompanyTimeRecord,
  useGetEmployee,
} from "hooks";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("TimeCardTable.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: { maxWidth: 800 },
  inner: { minWidth: 350 },
  content: {
    padding: 0,
  },
  bottomRow: {
    borderBottom: "none",
  },
  titleRow: {
    borderBottom: "none",
  },
  noSeperatorRow: {
    padding: 0,
    borderBottom: "none",
  },
  cardFooter: {
    justifyContent: "flex-end",
  },
  titleIcon: {
    color: theme.palette.icon,
  },
  linkIcon: {
    color: theme.palette.primary.main,
    "&:hover": {
      cursor: "pointer",
    },
  },
  actions: {
    justifyContent: "flex-end",
  },
  buttonContainer: {
    display: "flex",
    height: "100%",
  },
  buttonText: {
    padding: "none",
  },
  spinner: {
    position: "absolute",
    left: "50%",
    textAlign: "center",
  },
  loadingCell: {
    height: 80,
    border: "none",
    position: "relative",
  },
  outSideTotals: {
    paddingRight: theme.spacing(1),
  },
}));

/**
 *
 * @param {*} props
 */
const TimeRecordRow = (props) => {
  const { record, iconClassName } = props;
  const [open, setOpen] = useState(false);
  const { timestampIn: tIn, timestampOut: tOut = tIn } = record;
  const formatedTime = getFormatedTime(getTimeDifference(tIn, tOut));

  const handleClick = React.useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <TableRow hover>
      <TableCell padding="checkbox" align="center">
        <EditIcon className={iconClassName} onClick={handleClick} />
        <TimeRecord record={record} open={open} onClose={handleClose} />
      </TableCell>
      <TableCell>
        <DateLocal epochSeconds={tIn} local="es" format="l" />
      </TableCell>
      <TableCell align="center">
        {!!tOut ? (
          <React.Fragment>
            <DateLocal epochSeconds={tIn} local="es" format="LT" /> -{" "}
            <DateLocal epochSeconds={tOut} local="es" format="LT" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DateLocal epochSeconds={tIn} local="es" format="LT" />
            {" ..."}
          </React.Fragment>
        )}
      </TableCell>
      <TableCell align="right">{formatedTime}</TableCell>
    </TableRow>
  );
};

const CollapseIcon = (props) => {
  const { initialState = true, onClick, iconClassName } = props;
  const [open, setOpen] = useState(initialState);

  const handleClick = React.useCallback(() => {
    const o = !open;
    setOpen(o);
    if (onClick) onClick(o);
  }, [onClick, open]);

  return open ? (
    <KeyboardArrowUpIcon onClick={handleClick} className={iconClassName} />
  ) : (
    <KeyboardArrowDownIcon onClick={handleClick} className={iconClassName} />
  );
};

/**
 *
 */
const createTimeSheetRow = (timeRecords, iconClassName) =>
  timeRecords.reduce(
    (accumulator, current) => {
      const [rows, totalMinutes] = accumulator;
      const { id, timestampIn, timestampOut } = current;
      rows.push(
        <TimeRecordRow
          key={id}
          iconClassName={iconClassName}
          record={current}
        />
      );
      const updatedTotal =
        totalMinutes +
        getTimeDifference(timestampIn, timestampOut || timestampIn); // ingnores seconds

      return [rows, updatedTotal];
    },
    // [[TimeRecordRow], totalMinutes]
    [[], 0]
  );

const TimeCardTableMultiple = (props) => {
  const { companyId, fromDate, toDate, employeeIds = [], ...rest } = props;
  const { loading, data, fetchMore } = useListCompanyTimeRecord(companyId);
  const { listCompanyTimeRecords: { items } = {} } = data || {};

  useEffect(() => {
    if (companyId) {
      fetchMore({
        companyId,
        sortDirection: "DESC",
        limit: 25,
        timestamp: {
          between: [
            dateToUnixTimestamp(fromDate),
            dateToUnixTimestamp(toDate) + SECONDS_IN_DAY - 1,
          ],
        },
      });
    }
  }, [companyId, fetchMore, fromDate, toDate]);

  const timeRecords = useMemo(() => {
    const recordsMap = new Map();
    employeeIds.forEach((id) => recordsMap.set(id, []));

    return (items || []).reduce((recMap, curr) => {
      const r = recMap.get(curr.employeeId);
      if (r) r.push(curr);
      return recMap;
    }, recordsMap);
  }, [employeeIds, items]);

  console.log("filter", fromDate, toDate, employeeIds, companyId);
  console.log("filter", timeRecords);

  return (
    <PrivateTimeCardTable
      {...rest}
      timeRecords={timeRecords}
      isFetching={loading}
    />
  );
};

const TimeCardTableSingle = (props) => {
  const { fromDate, toDate, employeeIds, ...rest } = props;
  const [employeeId] = employeeIds;
  const [setVars, { loading, data }] = useListEmployeeTimeRecord({
    employeeId,
  });

  useEffect(() => {
    if (employeeId && fromDate && toDate) {
      logger.debug("RunQuery", employeeId, fromDate, toDate);
      setVars({
        employeeId,
        fromDate: dateToUnixTimestamp(fromDate),
        toDate: dateToUnixTimestamp(toDate) + SECONDS_IN_DAY - 1,
        limit: 25,
      });
    }
  }, [employeeId, fromDate, setVars, toDate]);

  const { items = [] } = (data && data.listEmployeeTimeRecords) || {};
  const recordsMap = new Map();
  if (items.length > 0) recordsMap.set(employeeId, items);
  logger.debug(
    "companyId, employeeId, fromDate, toDate",
    employeeId,
    fromDate,
    toDate
  );
  return (
    <PrivateTimeCardTable
      {...rest}
      timeRecords={recordsMap}
      isFetching={loading}
    />
  );
};
/**
 *
 * @param {*} props
 */
const EmployeeName = (props) => {
  const {
    timeRecord: { employeeId },
  } = props;

  const [
    setId,
    { data: { getEmployee: { firstName = "", lastName = "" } = {} } = {} },
  ] = useGetEmployee(employeeId);

  useEffect(() => {
    if (employeeId) setId(employeeId);
  }, [employeeId, setId]);

  return `${lastName}${firstName ? `,` : ``} ${firstName}`;
};

/**
 * Expects timeRecords to be grouped by employee and in decending order by timestamp
 * @param {*} props
 */
const PrivateTimeCardTable = (props) => {
  const classes = useStyles();
  // const [context] = useContext(Context);
  // const { employee } = context;
  // Left off here, I need to pass the employee recod and not the user to AddTimeButton

  const numOfCols = 4;
  const { className, timeRecords, employeeIds = [], isFetching } = props;
  const [collapseObj, setCollapseObj] = useState({});

  console.log(`Employee Filtering ${!!employeeIds}`);

  let totalMinutes = 0;
  const rows = [];
  // Loop through
  // creating a title row, and children rows
  console.log("timeRecords", timeRecords);
  timeRecords.forEach((value, key) => {
    if (value[0]) {
      // const {
      //   employee: { firstName, lastName },
      // } = value[0];
      const open = collapseObj[key] !== undefined ? collapseObj[key] : true;
      const [r, time] = createTimeSheetRow(value, classes.linkIcon);
      totalMinutes += time;
      const records = (
        <React.Fragment key={key}>
          <TableRow>
            <TableCell padding="checkbox" align="center">
              <CollapseIcon
                onClick={(isOpen) =>
                  setCollapseObj({ ...collapseObj, [key]: isOpen })
                }
                initialState={open}
                iconClassName={classes.linkIcon}
              />
            </TableCell>
            <TableCell colSpan={numOfCols - 2}>
              <Typography variant="h6" gutterBottom component="div">
                <EmployeeName timeRecord={value[0]} />
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                className={classes.outSideTotals}
                variant="h6"
                gutterBottom
                component="div"
              >
                {getFormatedTime(time)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={numOfCols}
              classes={{
                root: classes.noSeperatorRow,
              }}
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <Table size="small">
                    <TableBody>{r}</TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
      rows.push(records);
    }
  });

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" align="center">
                    <EditIcon className={classes.titleIcon} />
                  </TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="right">
                    <span className={classes.outSideTotals}>Hours</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={4} className={classes.loadingCell}>
                      <CircularProgress
                        color="secondary"
                        className={classes.spinner}
                      />
                    </TableCell>
                  </TableRow>
                ) : null}
                {rows.length ? (
                  rows
                ) : isFetching ? null : (
                  <TableRow>
                    <TableCell colSpan={4} className={classes.loadingCell}>
                      <Typography color="textSecondary" variant="body1">
                        No time yet for these dates. Let's get you clocked in!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {timeRecords.size !== 1 ? (
                <TableFooter>
                  <TableRow>
                    <TableCell padding="checkbox" align="center">
                      &nbsp;
                    </TableCell>
                    <TableCell colSpan={2} align="left">
                      <Typography variant="h6" gutterBottom component="div">
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className={classes.outSideTotals}
                        variant="h6"
                        gutterBottom
                        component="div"
                      >
                        {getFormatedTime(totalMinutes)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              ) : (
                <React.Fragment />
              )}
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid container justify="center">
          <Grid item xs>
            {/* {<AddTimeButton
              employee={employee}
              containerClass={classes.buttonContainer}
              buttonClassOverrides={{ text: classes.buttonText }}
            />} */}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

/**
 *
 * @param {*} props
 */
const TimeCardTable = (props) => {
  const { singleEmployee, ...rest } = props;

  return singleEmployee ? (
    <TimeCardTableSingle {...rest} />
  ) : (
    <TimeCardTableMultiple {...rest} />
  );
};

TimeCardTable.propTypes = {
  companyId: PropTypes.string,
  employeeIds: PropTypes.array,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  singleEmployee: PropTypes.bool,
};

export default TimeCardTable;
