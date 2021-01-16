import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Grid } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import PropTypes from "prop-types";
import AvatarEditor from "react-avatar-editor";
import { Logger } from "aws-amplify";
import { ZoomSlider } from "components";
import { DropFileBrowse } from "components";
import { DialogTemplate } from "../components";
import { WebcamCapture } from "components";
import CropRotateIcon from "@material-ui/icons/CropRotate";
import { makeStyles } from "@material-ui/styles";

const logger = new Logger("ProfilePictureDialog.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  middle: {
    height: "100%",
  },
}));

const UploadScean = (props) => {
  const classes = useStyles();
  const { onFileChange, onFileError } = props;
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      classes={{ root: classes.middle }}
    >
      <Grid item xs={12}>
        <DropFileBrowse onFileChange={onFileChange} onFileError={onFileError} />
        <DialogContentText>
          Click here to choose an exisiting photo from your device.
        </DialogContentText>
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
  const { open, handleClose, onFile, onFileError } = props;
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scean, setScean] = useState(UPLOAD_SCEAN);
  const webcamRef = useRef(null);
  const title = "Upload Profile Picture";

  console.debug("imageURL", image);

  useEffect(() => {
    // Always return to Upload Scean on re-renders
    if (open) {
      setImage(null);
      setScean(UPLOAD_SCEAN);
    }
  }, [open]);

  const onFileChange = (files) => {
    logger.debug("files", files);
    if (files && files.length > 0) {
      const {
        preview: { url },
      } = files[0];
      logger.debug("url", url);
      setImage(url);
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
      handleClose();
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
          color="secondary"
        >
          Use Camera
        </Button>
      );
      break;
    case WEBCAM_SCEAN:
      dialogContent = webCamScean;
      actions.push(
        <Button key="btnOne" autoFocus onClick={capture} color="secondary">
          Take Photo
        </Button>
      );
      break;
    case EDIT_SCEAN:
      dialogContent = cropScean;
      actions.push(
        <Button key="btnOne" autoFocus onClick={handleCrop} color="secondary">
          Save
        </Button>
      );
      break;
    default:
      logger.error("Unknow scean, deafulting to UPLOAD_SCEAN", scean);
      dialogContent = uploadScean;
      break;
  }
  const isWebcamScean = scean === WEBCAM_SCEAN;
  const cancleBtn = (
    <Button
      key="btnTwo"
      autoFocus
      onClick={isWebcamScean ? handleUseFile : handleClose}
      color="primary"
    >
      {isWebcamScean ? "Back" : "Cancel"}
    </Button>
  );
  actions.push(cancleBtn);

  return (
    <DialogTemplate
      open={open}
      handleClose={handleClose}
      title={title}
      dialogContent={dialogContent}
      actions={actions}
    />
  );
};

ProfilePictureDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onFile: PropTypes.func.isRequired,
  onFileError: PropTypes.func,
};

export default ProfilePictureDialog;
