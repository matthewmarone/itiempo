import React from "react";
import { Dialog, DialogActions, Typography } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  paper: { width: 550, textAlign: "center" },
  paperMobile: {
    backgroundColor: theme.palette.background.default,
    textAlign: "center",
  },
  title: { textAlign: "center" },
}));

const DialogTemplate = (props) => {
  const { open, handleClose, title, dialogContent, actions } = props;
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        classes={
          fullScreen
            ? {
                paper: classes.paperMobile,
              }
            : { paper: classes.paper }
        }
      >
        <DialogTitle
          id="responsive-dialog-title"
          className={classes.title}
          disableTypography={true}
        >
          <Typography variant="h3" color="textPrimary">{title}</Typography>
        </DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </div>
  );
};

DialogTemplate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  dialogContent: PropTypes.object,
  actions: PropTypes.array,
};

export default DialogTemplate;
