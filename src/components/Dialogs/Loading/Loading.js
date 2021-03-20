import React, { useCallback } from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { DialogTemplate } from "../components";
import { CenterContent } from "components";
import PropTypes from "prop-types";

const Content = (props) => {
  const { message } = props;
  return (
    <CenterContent>
      <CircularProgress />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </CenterContent>
  );
};
Content.propTypes = { message: PropTypes.string };

/**
 *
 * @param {*} props
 */
const Loading = (props) => {
  const { open, onClose, message, title = "Loading" } = props;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <DialogTemplate
      open={open}
      handleClose={handleClose}
      title={title}
      dialogContent={<Content message={message || ""} />}
      actions={[
        <Button key="cancel" onClick={handleClose} color="primary">
          Cancel
        </Button>,
      ]}
    />
  );
};

Loading.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default Loading;
