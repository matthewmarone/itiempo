import React from "react";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { Avatar } from "components";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginLeft: "auto",
    height: "1.5 em",
    width: "1.5 em",
    flexShrink: 0,
    flexGrow: 0,
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

/**
 *
 * @param {*} props
 */
const AvatarMenuItem = (props) => {
  const classes = useStyles();
  const { firstName, lastName, avatarUrl } = props;

  return (
    <div className={classes.nameContainer}>
      <Avatar className={classes.avatar} {...{ firstName, avatarUrl }} />
      &nbsp;{firstName + " " + lastName}
    </div>
  );
};

AvatarMenuItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatarUrl: PropTypes.any,
};

export default AvatarMenuItem;
