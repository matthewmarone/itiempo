import React from "react";
import { Avatar } from "@material-ui/core";
import { getInitials } from "helpers";
import PropTypes from "prop-types";
/**
 *
 * @param {*} props
 */
const MyAvatar = (props) => {
  const { firstName, lastName, avatarUrl, className } = props;
  const name = `${firstName || ""} ${lastName || ""}`.trim();

  return (
    <Avatar className={className} src={avatarUrl}>
      {getInitials(name || "?")}
    </Avatar>
  );
};
MyAvatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatarUrl: PropTypes.any,
  className: PropTypes.string,
};

export default MyAvatar;
