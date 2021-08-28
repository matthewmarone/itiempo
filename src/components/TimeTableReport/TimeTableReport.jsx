import React from "react";
import { Table } from "./components";

function createData(id, name, calories, fat, carbs, protein, price) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { id: 1, date: "2020-01-05", customerId: "11091700", amount: 3 },
      { id: 2, date: "2020-01-02", customerId: "Anonymous", amount: 1 },
    ],
  };
}

/**
 * TimeCardTable provides a table like report
 * showing a filtered view of Employee TimeRecords.<br />
 * <br />
 * The report allows for filtering on:<br />
 * <ul>
 *  <li>Dates</li>
 *  <li>Employees</li>
 *  <li>Employee Department</li>
 *  <li>Employee Manager</li>
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
 *  <li>Shows primary manager</li>
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
 *  <li>Flags note/no note</li>
 * </ul>
 *
 * @param {*} props
 */
const TimeTableReport = (props) => {
  const rows = [
    createData(1, "Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
    createData(2, "Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
    createData(3, "Eclair", 262, 16.0, 24, 6.0, 3.79),
    createData(4, "Cupcake", 305, 3.7, 67, 4.3, 2.5),
    createData(5, "Gingerbread", 356, 16.0, 49, 3.9, 1.5),
  ];

  const groupedRecords = [
    { category: "Frozen", records: rows.slice(0, 2) },
    { category: "Pastry", records: rows.slice(2) },
  ];
  return <Table groupedRecords={groupedRecords} />;
};

export default TimeTableReport;
