import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    whiteSpace: "nowrap",
  },
}));

/**
 *
 * @param {*} props - local defaults to 'en', format to 'lll' and noWrap to true
 */
const DateLocal = (props) => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { epochSeconds, local = "en", format = "lll", noWrap = true } = props;

  return (
    <span className={!noWrap || classes.root}>
      {epochSeconds > 0 ? moment(epochSeconds * 1000).format(format) : ""}
    </span>
  );
};
DateLocal.propTypes = {
  epochSeconds: PropTypes.number.isRequired,
  format: PropTypes.string,
  local: PropTypes.string,
  noWrap: PropTypes.bool,
};

export default DateLocal;
