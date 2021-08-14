import React from "react";
import { Table } from "./components";

/**
 * TimeCardTable provides a table like report
 * showing a filtered view of Employee TimeRecords.<br />
 * <br />
 * The report allows for filtering on:<br />
 * <ul>
 *  <li>Dates</li>
 *  <li>Employees</li>
 *  <li>Employee Department</li>
 * </ul>
 * <br />
 * The result provides the following insights & features:
 * <ul>
 *  <li>Shows employee name</li>
 *  <li>Shows date and time clocked in and out, or currently clocked in</li>
 *  <li>Shows lunches/breaks</li>
 *  <li>Shows pay rate</li>
 *  <li>Shows total hours</li>
 *  <li>Shows total pay</li>
 *  <li>Shows department</li>
 *  <li>Weekly Overtime Hours & Pay</li>
 *  <li>Allows for Applying Rounding Rules</li>
 *  <li>Flags TimeSheet Approval status</li>
 *  <li>Flags Overlapping Time Record</li>
 *  <li>Flags Abnormal Shift Length (8 hours+)</li>
 *  <li>Flags overtime (Weekly)</li>
 *  <li>Flags manual entries</li>
 *  <li>Flags no photo</li>
 *  <li>Flags no gps location</li>
 *  <li>Flags if pay rate wasn't explicitly chosen</li>
 *  <li>Flags if there's a note</li>
 * </ul>
 *
 * @param {*} props
 */
const TimeTableReport = (props) => {
  return <Table />;
};

export default TimeTableReport;
