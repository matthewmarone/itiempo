import React, { useEffect, useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {
    // display: "flex",
    // position: "relative",
    // justifyContent: "center",
    // alignItems: "center",
  },
  image: { maxWidth: "100%", maxHeight: "100%" },
  span: { textAlign: "left", display: "inline-block", width: "100%" },
});

/**
 * Displays a CircularProgress untill the image src is provided
 * @param {*} props
 */
const Image = (props) => {
  const {
    src,
    alt,
    imgContainerClass,
    imgClass,
    label,
    fallback = "/images/avatars/user-silhouette.svg",
  } = props;
  const classes = useStyles();
  const [imageError, setImageError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const tId = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(tId);
  }, []);

  const handleError = React.useCallback(() => {
    setImageError(true);
  }, []);

  const loading = !src && !timedOut;
  return (
    <div className={clsx(classes.root, imgContainerClass)}>
      {!label || (
        <React.Fragment>
          <span className={clsx(classes.span)}>{label}</span>
          <br />
        </React.Fragment>
      )}
      {!loading ? (
        <img
          className={clsx(classes.image, imgClass)}
          alt={alt}
          src={!imageError ? src || fallback : fallback}
          onError={handleError}
        />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
};

export default Image;
