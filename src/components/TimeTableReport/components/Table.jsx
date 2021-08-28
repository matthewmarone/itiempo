import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TimeRecordRow, { TimeRecordHeaderRow } from "./TimeRecordRow";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

/**
 *
 * @param {*} props
 * @returns
 */
const SummeryRow = (props) => {
  const {
    recordGroup: { category, records },
  } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {category}
        </TableCell>
        <TableCell align="right">{`rowGroup.calories`}</TableCell>
        <TableCell align="right">{`rowGroup.fat`}</TableCell>
        <TableCell align="right">{`rowGroup.carbs`}</TableCell>
        <TableCell align="right">{`rowGroup.protein`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Employees
              </Typography>
              <Table aria-label="employee table">
                <TableBody>
                  {records.map((rec) => (
                    <Row key={rec.id} record={rec} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
SummeryRow.propTypes = {
  recordGroup: PropTypes.shape({
    category: PropTypes.string.isRequired,
    records: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  }).isRequired,
};

/**
 *
 * @param {*} props
 * @returns
 */
const Row = (props) => {
  const { record } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {record.name}
        </TableCell>
        <TableCell align="right">{record.calories}</TableCell>
        <TableCell align="right">{record.fat}</TableCell>
        <TableCell align="right">{record.carbs}</TableCell>
        <TableCell align="right">{record.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Time Records
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TimeRecordHeaderRow />
                </TableHead>
                <TableBody>
                  {record.history.map((historyRow) => (
                    <TimeRecordRow record={historyRow} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
Row.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    companyId: PropTypes.string.isRequired,
    timestampIn: PropTypes.number.isRequired,
    timestampOut: PropTypes.number,
    clockInDetails: PropTypes.object.isRequired,
    clockOutDetails: PropTypes.object,
    rate: PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      isHourly: PropTypes.bool.isRequired,
      isDefault: PropTypes.bool.isRequired,
    }),
    approved: PropTypes.bool,
    approvedBy: PropTypes.string,
    _version: PropTypes.number.isRequired,
    _deleted: PropTypes.bool,
    _lastChangedAt: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    updatedAt: PropTypes.number.isRequired,
  }).isRequired,
};

/**
 *
 * @param {*} props
 * @returns
 */
const ReportTable = (props) => {
  const { groupedRecords } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // Show with SummeryRow(s) if there are categories
            groupedRecords[0]?.category
              ? groupedRecords.map((recGrp) => (
                  <SummeryRow key={recGrp.category} recordGroup={recGrp} />
                ))
              : // Otherwise just show all records, which are still
                // grouped by employees
                groupedRecords[0]?.records.map((rec) => (
                  <Row key={rec.id} record={rec} />
                ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};
ReportTable.propTypes = {
  groupedRecords: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      records: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default ReportTable;
