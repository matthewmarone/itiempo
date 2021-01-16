import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Typography, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const { className, copyRightYaer, ...rest } = props;

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography variant="body1">
        &copy;{" "}
        <Link component="a" href="https://www.iTiempo.com/" target="_blank">
          iTiempo! LLC
        </Link>
        &nbsp;{copyRightYaer}
      </Typography>
      <Typography variant="caption">
        Because time is a valuable thing.
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  copyRightYaer: PropTypes.string.isRequired,
};

export default Footer;
