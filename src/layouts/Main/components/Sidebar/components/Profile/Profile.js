import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography } from "@material-ui/core";
import { getInitials } from "helpers";
import { I18n } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  nameHidden: {
    marginTop: theme.spacing(1),
    color: "transparent",
    textAlign: "center",
  },
}));
/**
 *
 * @param {*} props
 */
const Profile = (props) => {
  const classes = useStyles();
  const {
    className,
    onClose,
    profileURL,
    avatarURL,
    profileName,
    clockedIn,
    ...rest
  } = props;
  const subtext = I18n.get(`Clocked-${clockedIn ? `in` : `out`}`)
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt={I18n.get("Profile Photo")}
        className={classes.avatar}
        component={RouterLink}
        src={avatarURL}
        to={profileURL}
        onClick={onClose}
      >
        {getInitials(profileName)}
      </Avatar>
      <Typography
        className={profileName ? classes.name : classes.nameHidden}
        variant="h4"
      >
        <RouterLink
          to={profileURL}
          onClick={onClose}
          style={{ color: "inherit" }}
        >
          {profileName ? profileName : "..."}
        </RouterLink>
      </Typography>
      <Typography variant="body2">{subtext}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  profileName: PropTypes.string.isRequired,
  profileURL: PropTypes.string,
  avatarURL: PropTypes.string,
  clockedIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
