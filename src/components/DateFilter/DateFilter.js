import React from "react";
import { Grid, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { I18n } from "aws-amplify";
/**
 *
 * @param {*} props
 */
const DateFilter = (props) => {
  const { fromDate, toDate, onChange: handleDateChange, spacing = 3 } = props;
  return (
    <Grid container item spacing={spacing}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="date"
          label={I18n.get("From Date")}
          name="fromDate"
          onChange={handleDateChange}
          variant="outlined"
          margin="dense"
          value={fromDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="date"
          label={I18n.get("To Date")}
          name="toDate"
          onChange={handleDateChange}
          variant="outlined"
          margin="dense"
          value={toDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  );
};
DateFilter.propTypes = {
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  spacing: PropTypes.number,
};

export default DateFilter;