import React from "react";
import { TableRow, TableCell } from "@material-ui/core";

/**
 *
 * @param {*} props
 */
export const TimeRecordHeaderRow = (props) => {
  return (
    <TableRow>
      <TableCell>Date</TableCell>
      <TableCell>Customer</TableCell>
      <TableCell align="right">Amount</TableCell>
      <TableCell align="right">Total price ($)</TableCell>
    </TableRow>
  );
};

/**
 *
 * @param {*} props
 * @returns
 */
const TimeRecordRow = (props) => {
  const {
    record: { id, date, customerId, amount, price },
  } = props;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {date}
      </TableCell>
      <TableCell>{customerId}</TableCell>
      <TableCell align="right">{amount}</TableCell>
      <TableCell align="right">
        {Math.round(amount * price * 100) / 100}
      </TableCell>
    </TableRow>
  );
};

export default TimeRecordRow;
