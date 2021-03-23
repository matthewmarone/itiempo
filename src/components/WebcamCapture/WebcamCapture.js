import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { Logger } from "aws-amplify";
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { VideocamOffTwoTone } from "@material-ui/icons";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("WebcamCapture.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
  },
  visible: {},
  spinner: {
    position: "absolute",
    top: "40%",
    left: "38%",
  },
}));

const videoConstraints = {
  //   width: 1280,
  //   height: 720,
  facingMode: "user",
};

const LoadingCamera = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.spinner}>
      <CircularProgress />
      <Typography variant="body1" color="textSecondary">
        Loading camera...
      </Typography>
    </div>
  );
};

const WebcamCapture = React.forwardRef((props, webcamRef) => {
  const {
    onReady,
    onUserMedia: onUsrMedia,
    onUserMediaError: onUsrMediaError,
    width = 300,
    height = 300,
    screenshotQuality = 1,
  } = props;

  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onUserMedia = React.useCallback(() => {
    if (onUsrMedia) onUsrMedia();
  }, [onUsrMedia]);

  const onUserMediaError = React.useCallback(
    (error) => {
      logger.error(error);
      if (onUsrMediaError) onUsrMediaError(error);
      setIsLoading(false);
      setError(error);
    },
    [onUsrMediaError]
  );

  useEffect(() => {
    const max_attempts = 7;
    let timmerId = null,
      attempts = 0;
    if (isLoading) {
      timmerId = window.setInterval(() => {
        if (!!webcamRef.current.getScreenshot()) {
          window.clearInterval(timmerId);
          if (onReady) onReady();
          setIsLoading(false);
          return;
        }
        if (++attempts === max_attempts) {
          window.clearInterval(timmerId);
          onUserMediaError(
            new Error("Camera is still not available after 7 seconds")
          );
        }
      }, 1000);
    }

    return () => {
      if (timmerId) {
        window.clearInterval(timmerId);
      }
    };
  }, [isLoading, onReady, onUserMediaError, webcamRef]);

  return (
    <div className={classes.root}>
      <Webcam
        className={classes.visible}
        audio={false}
        height={height}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={width}
        screenshotQuality={screenshotQuality}
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
        onUserMediaError={onUserMediaError}
      />
      {!isLoading || <LoadingCamera />}
      {!error || (
        <VideocamOffTwoTone
          className={classes.spinner}
          fontSize="large"
          color="secondary"
        />
      )}
    </div>
  );
});
WebcamCapture.propTypes = {
  onReady: PropTypes.func,
  onUserMedia: PropTypes.func,
  onUserMediaError: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  screenshotQuality: PropTypes.number,
};

export default WebcamCapture;
