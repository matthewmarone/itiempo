import React, { useContext, useMemo } from "react";
import { Context } from "Store";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { useListEmployeesByEmail } from "hooks";
import PropTypes from "prop-types";
import { I18n } from "aws-amplify";

/**
 *
 * @param {*} props
 */
const SingleEmployeeSelect = (props) => {
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const { employeeId, onChange, classes } = props;
  const { error, data } = useListEmployeesByEmail(companyId);
  if (error) console.error(error);

  const menuItems = useMemo(() => {
    if (data && data.listEmployeesByEmail && data.listEmployeesByEmail.items) {
      return data.listEmployeesByEmail.items.map(
        ({ id, firstName, lastName }) => (
          <MenuItem key={id} value={id}>
            {`${firstName} ${lastName}`}
          </MenuItem>
        )
      );
    } else {
      return [];
    }
  }, [data]);

  const handleChange = ({ target: { value } }) => onChange(value);

  const value = menuItems.length ? employeeId : "";

  return (
    <FormControl classes={classes}>
      <InputLabel htmlFor="work-and-rate">{I18n.get("Employee")}</InputLabel>
      <Select value={value} onChange={handleChange}>
        {menuItems}
      </Select>
    </FormControl>
  );
};

SingleEmployeeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  employeeId: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

export default SingleEmployeeSelect;
