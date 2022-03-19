import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Typography, Link } from "@material-ui/core";
import { I18n } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const { className, copyRightYear, ...rest } = props;

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography variant="body1">
        &copy;{" "}
        <Link component="a" href="https://www.iTiempo.com/" target="_blank">
          iTiempo! LLC
        </Link>
        &nbsp;{copyRightYear}
      </Typography>
      <Typography variant="caption">
        {I18n.get("Because time is a valuable thing.")}
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  copyRightYear: PropTypes.string.isRequired,
};

export default Footer;
