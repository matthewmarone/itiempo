import React, { useEffect, useState, useCallback } from "react";
import { useGetEmployee } from "hooks";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select } from "@material-ui/core";
/**
 *
 * @param {*} param0
 */
const EmployeePayRateSelect = (props) => {
  const { employeeId, rate, onChange, classes } = props;
  const [payRateIndex, setPayRateIndex] = useState("0");
  const [setId, { data, loading }] = useGetEmployee(employeeId);
  const { getEmployee: { payRates } = {} } = data || {};

  useEffect(() => {
    setId(employeeId);
  }, [employeeId, setId]);

  /**
   *
   */
  const setRate = useCallback(
    (rate, payRates) => {
      // Look for the rate in our employee payRates
      const rateI = payRates.findIndex(
        (r) => r.name === rate?.name && r.amount === rate?.amount
      );
      if (rateI >= 0) {
        // Found the rate, update the view
        setPayRateIndex(`${rateI}`);
      } else {
        // Let's switch it to the default
        const defaultI = payRates.findIndex((r) => r?.isDefault === true);
        // ... or switch to the first rate if no default
        const newIdx =
          defaultI !== -1 ? defaultI : payRates.length > 0 ? 0 : -1;

        if (newIdx !== -1) {
          // We've got a rate
          setPayRateIndex(`${newIdx}`);
          onChange({ ...payRates[newIdx] });
        } else {
          // The rate no longer exists or is not valid for this employee
          setPayRateIndex("0");
          onChange(null);
        }
      }
    },
    [onChange]
  );

  /**
   * Update the selected rate whenever the payRates, or rate changes
   */
  useEffect(() => {
    if (Array.isArray(payRates) || !loading) setRate(rate, payRates);
  }, [loading, payRates, rate, setRate]);

  /**
   *
   */
  const handleChange = useCallback(
    ({ target: { value } }) => {
      onChange(payRates?.[value]);
    },
    [onChange, payRates]
  );

  return (
    <FormControl classes={classes}>
      <InputLabel htmlFor="work-and-rate">Job / Rate</InputLabel>
      <Select
        native
        name="payRateIndex"
        value={payRateIndex}
        onChange={handleChange}
        inputProps={{
          name: "payRateIndex",
          id: "work-and-rate",
        }}
      >
        {payRates?.length > 0 ? (
          payRates.map((v, i) => (
            <option key={i} value={`${i}`}>{`${v?.name || ``} - $${
              v?.amount || ``
            }`}</option>
          ))
        ) : (
          <option value="0">None</option>
        )}
      </Select>
    </FormControl>
  );
};

EmployeePayRateSelect.propTypes = {
  employeeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default EmployeePayRateSelect;
