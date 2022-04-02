import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Grid } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import PropTypes from "prop-types";
import AvatarEditor from "react-avatar-editor";
import { ZoomSlider } from "components";
import { DialogTemplate } from "../components";
import { WebcamCapture } from "components";
import CropRotateIcon from "@material-ui/icons/CropRotate";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import { makeStyles } from "@material-ui/styles";
import { useDropzone } from "react-dropzone";
import { I18n } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  middle: {
    height: "100%",
  },
  deleteBtn: {
    color: "red",
  },
}));

const UploadScean = (props) => {
  const classes = useStyles();
  const { onFileChange: onDrop } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });
  const color = isDragActive ? "secondary" : "primary";
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      classes={{ root: classes.middle }}
    >
      <Grid item xs={12}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <PhotoLibraryIcon fontSize="large" color={color} />
          <DialogContentText color={color}>
            {I18n.get(
              "Drag 'n' drop or click here to choose a photo from your device."
            )}
          </DialogContentText>
        </div>
      </Grid>
    </Grid>
  );
};
UploadScean.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  onFileError: PropTypes.func,
};

const CropScean = (props) => {
  const { image, refFunction } = props;
  const [scalePercent, setScalePercent] = useState(50);
  const [rotate, setRotate] = useState(0);
  const handleRotate = useCallback(() => {
    let r = rotate - 90;
    if (r < 0) {
      r += 360;
    }
    setRotate(r);
  }, [rotate]);
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <AvatarEditor
            ref={refFunction}
            image={image}
            border={50}
            scale={(scalePercent * 2) / 100}
            rotate={rotate}
            max={200}
          />
        </div>
      </Grid>
      <Grid item>
        <ZoomSlider
          value={scalePercent}
          handleChange={(v) => setScalePercent(v)}
        />
      </Grid>
      <Grid item>
        <CropRotateIcon onClick={handleRotate} color="primary" />
      </Grid>
    </Grid>
  );
};
CropScean.propTypes = {
  image: PropTypes.any.isRequired,
  refFunction: PropTypes.func.isRequired,
};

const UPLOAD_SCEAN = "UPLOAD_SCEAN";
const WEBCAM_SCEAN = "WEBCAM_SCEAN";
const EDIT_SCEAN = "EDIT_SCEAN";

const ProfilePictureDialog = (props) => {
  const classes = useStyles();
  const { open, onClose, onFile, onFileError, onRemovePhoto } = props;
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scean, setScean] = useState(UPLOAD_SCEAN);
  const webcamRef = useRef(null);
  const title = I18n.get("Upload Profile Picture");

  useEffect(() => {
    // Always return to Upload Scean on re-renders
    if (open) {
      setImage(null);
      setScean(UPLOAD_SCEAN);
    }
  }, [open]);

  const onFileChange = (files) => {
    if (files && files.length > 0) {
      // const {
      //   preview: { url },
      // } = files[0];
      setImage(files[0]);
      setScean(EDIT_SCEAN);
    }
  };

  const capture = React.useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    if (img) {
      setImage(img);
      setScean(EDIT_SCEAN);
    }
  }, [webcamRef]);

  const handleCrop = () => {
    const canvas = editor.getImageScaledToCanvas();
    // const dataUrl = canvas.toDataURL('image/png', 1);
    canvas.toBlob((blob) => {
      onFile(blob);
      onClose();
    });
  };

  const refFunction = (e) => setEditor(e);

  const handleUseCamera = () => setScean(WEBCAM_SCEAN);
  const handleUseFile = () => setScean(UPLOAD_SCEAN);

  const uploadScean = UploadScean({ onFileChange, onFileError });
  const webCamScean = <WebcamCapture ref={webcamRef} />;
  const cropScean = CropScean({ image, refFunction });

  const actions = [];
  let dialogContent;
  switch (scean) {
    case UPLOAD_SCEAN:
      dialogContent = uploadScean;
      actions.push(
        <Button
          key="btnOne"
          autoFocus
          onClick={handleUseCamera}
          color="primary"
          variant="contained"
        >
          {I18n.get("Use Camera")}
        </Button>
      );
      if (onRemovePhoto)
        actions.push(
          <Button
            key="btnRmvCamera"
            autoFocus
            onClick={() => {
              onRemovePhoto();
              onClose();
            }}
            color="secondary"
            variant="outlined"
            classes={{ outlinedSecondary: classes.deleteBtn }}
          >
            {I18n.get("Remove Photo")}
          </Button>
        );
      break;
    case WEBCAM_SCEAN:
      dialogContent = webCamScean;
      actions.push(
        <Button
          key="btnOne"
          autoFocus
          onClick={capture}
          color="primary"
          variant="contained"
        >
          {I18n.get("Take Photo")}
        </Button>
      );
      break;
    case EDIT_SCEAN:
      dialogContent = cropScean;
      actions.push(
        <Button
          key="btnOne"
          autoFocus
          onClick={handleCrop}
          color="primary"
          variant="contained"
        >
          {I18n.get("Save")}
        </Button>
      );
      break;
    default:
      console.error("Unknown scene, defaulting to UPLOAD_SCEAN", scean);
      dialogContent = uploadScean;
      break;
  }
  const isWebcamScean = scean === WEBCAM_SCEAN;
  const cancleBtn = (
    <Button
      key="btnTwo"
      autoFocus
      onClick={isWebcamScean ? handleUseFile : onClose}
      color="secondary"
      variant="outlined"
    >
      {isWebcamScean ? I18n.get("Back") : I18n.get("Cancel")}
    </Button>
  );
  actions.push(cancleBtn);

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title={title}
      dialogContent={dialogContent}
      actions={actions}
    />
  );
};

ProfilePictureDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFile: PropTypes.func.isRequired,
  onFileError: PropTypes.func,
  onRemovePhoto: PropTypes.func,
};

export default ProfilePictureDialog;
