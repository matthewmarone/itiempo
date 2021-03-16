import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import { ProfilePictureDialog, SetPinDialog } from "components";
import { v4 as uuid } from "uuid";
import { useSnackbar } from "notistack";
import { Logger } from "aws-amplify";
import { useDownloadImage, useUploadImage } from "hooks";
// eslint-disable-next-line no-unused-vars
const logger = new Logger("UserProfile.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {},
  details: {
    display: "flex",
  },
  avatar: {
    marginLeft: "auto",
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    cursor: "pointer",
  },
  progress: {
    marginTop: theme.spacing(2),
  },
}));
/**
 *
 * @param {*} props
 */
const EmployeeProfile = (props) => {
  const classes = useStyles();
  const { employee, onPhotoSave, ...rest } = props;
  const {
    className,
    firstName,
    lastName,
    jobTitle,
    roles,
    profilePhoto,
  } = employee;
  const role = roles && roles[0] ? roles[0] : "Employee";

  const [upload, { loading, error, response }] = useUploadImage();
  const [setPhotoVars, { data: avatarUrl }] = useDownloadImage({
    key: profilePhoto,
  });

  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [openPinDialog, setOpenPinDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [uploadingKey, setUploadingKey] = useState();

  useEffect(() => {
    if (uploadingKey && !loading && !error && response) {
      onPhotoSave(uploadingKey);
      setUploadingKey(null);
    }
  }, [error, loading, onPhotoSave, response, uploadingKey]);

  const handleOnFile = (blob) => {
    if (blob) {
      const { companyId = "unspecified" } = employee;
      const key = `accts/${companyId}/profile-imgs/${uuid()}.png`;
      upload(key, blob);
      setUploadingKey(key);
      enqueueSnackbar("Uploading photo");
    }
  };

  const handleRemoveProfilePicture = () => {
    onPhotoSave(null);
  };

  const handleOnFileError = () => {};

  useEffect(() => {
    if (profilePhoto) {
      setPhotoVars({ key: profilePhoto });
    }
  }, [profilePhoto, setPhotoVars]);

  console.log("My profile photo", profilePhoto);

  return (
    <React.Fragment>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography gutterBottom variant="h2">
                {(firstName || "First Name") + " " + (lastName || "Last Name")}
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                {"Title: " + (jobTitle || "")}
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                {"Role: " + (role || "")}
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src={!profilePhoto ? "" : avatarUrl}
              onClick={() => setOpenPhotoDialog(true)}
            >
              <AddAPhotoOutlinedIcon style={{ color: "white" }} />
            </Avatar>
          </div>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="text"
            onClick={() => setOpenPinDialog(true)}
          >
            Set Pin
          </Button>
          <Button variant="text" onClick={handleRemoveProfilePicture}>
            Reset Password
          </Button>
        </CardActions>
      </Card>
      <ProfilePictureDialog
        open={openPhotoDialog}
        onClose={() => setOpenPhotoDialog(false)}
        onFile={handleOnFile}
        onFileError={handleOnFileError}
        onRemovePhoto={!profilePhoto ? undefined : handleRemoveProfilePicture}
      />
      <SetPinDialog
        open={openPinDialog}
        onClose={() => setOpenPinDialog(false)}
      />
    </React.Fragment>
  );
};

EmployeeProfile.propTypes = {
  className: PropTypes.string,
  employee: PropTypes.object.isRequired,
  onPhotoSave: PropTypes.func.isRequired,
};

export default EmployeeProfile;
