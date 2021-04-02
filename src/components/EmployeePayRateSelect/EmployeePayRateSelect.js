import React, { useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select } from "@material-ui/core";
/**
 *
 * @param {*} rate required a payRate object
 * @param {*} payRates
 * @returns returns [rate, idx] where idx is the index of the matching rate, if no match [null, -1] is returned
 */
const findRate = (rate, payRates) => {
  const idx = payRates?.findIndex(
    (r) => r.name === rate.name && r.amount === rate.amount
  );
  if (idx >= 0) return [payRates[idx], idx];
  return [null, -1];
};

/**
 *
 * @param {*} param0
 */
const EmployeePayRateSelect = (props) => {
  const { classes, rate, payRates, onChange } = props;

  const handleChange = useCallback(
    ({ target: { value } }) => {
      onChange(payRates?.[value] || null);
    },
    [onChange, payRates]
  );

  const [verifiedRate, displayIdx] = useMemo(() => {
    if (rate) {
      // Find the rate, or set to null if not found
      return findRate(rate, payRates);
    } else {
      // Temporary display none until done loading rates
      // or if no rate is chosen
      return [null, -1];
    }
  }, [payRates, rate]);

  useEffect(() => {
    // Set rate to null if not valid
    if (verifiedRate === null && rate !== null && payRates) onChange(null);
  }, [onChange, payRates, rate, verifiedRate]);

  return (
    <FormControl classes={classes}>
      <InputLabel htmlFor="work-and-rate">Job / Rate</InputLabel>
      <Select
        native
        name="payRateIndex"
        value={displayIdx}
        onChange={handleChange}
        inputProps={{
          name: "payRateIndex",
          id: "work-and-rate",
        }}
      >
        <option value="-1">None - $0.00</option>
        {payRates?.map((v, i) => (
          <option key={i} value={`${i}`}>
            {`${v?.name || ``} - $${v?.amount || ``}${
              v?.isDefault === true ? ` (default)` : ``
            }`}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

EmployeePayRateSelect.propTypes = {
  rate: PropTypes.object,
  payRates: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default EmployeePayRateSelect;
