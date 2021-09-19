import React from "react";
import { TableRow, TableCell } from "@material-ui/core";
import { 
  Image as ImageIcon,
  Notes as NotesIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon

} from "@material-ui/icons";

/**
 *
 * @param {*} props
 */
export const TimeRecordHeaderRow = (props) => {
  const align = "left";
  return (
    <TableRow>
      <TableCell align={align}>Date</TableCell>
      <TableCell align={align}>Time</TableCell>
      <TableCell align={align}>Approved</TableCell>
      <TableCell align={align}>Info</TableCell>
      <TableCell align={align}>Breaks</TableCell>
      <TableCell align={align}>Overtime</TableCell>
      <TableCell align={align}>Total</TableCell>
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
  const fontSize = "small";
  return (
    <TableRow key={id}>
      <TableCell>{date}</TableCell>
      <TableCell>09:15 AM - 05:00 PM</TableCell>
      <TableCell>Yes</TableCell>
      <TableCell>
        <ImageIcon fontSize={fontSize} />
        <NotesIcon fontSize={fontSize} />
        <LocationIcon fontSize={fontSize} />
        <MoneyIcon fontSize={fontSize} />
        <WarningIcon fontSize={fontSize} />
        <ErrorIcon fontSize={fontSize} />
      </TableCell>
      <TableCell>01:15</TableCell>
      <TableCell>00:00 / $0,000.00</TableCell>
      <TableCell>00:00 / $0,000.00</TableCell>
    </TableRow>
  );
};

export default TimeRecordRow;
