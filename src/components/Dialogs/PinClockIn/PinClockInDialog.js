import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { usePunchInByPin, useUploadImage } from "hooks";
import { default as EnterPinDialog } from "../EnterPin";
import { default as ClockinDialogTwo } from "../ClockinTwo";
import { default as LoadingDialog } from "../Loading";
import { v4 as uuidv4 } from "uuid";

const scene = {
  pinPad: "pinPad",
  photoAndNote: "photoAndNote",
  loading: "loading",
};

/**
 *
 * @param {*} props
 */
const PinClockInDialog = (props) => {
  const { open, onClose, pinRecords } = props;
  const [showScene, setShowScene] = useState(scene.pinPad);
  const [pin, setPin] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [punchIn, { loading, error, data }] = usePunchInByPin();
  const [uploadImg, { error: imgError, response }] = useUploadImage();

  console.log("imgError, response", imgError, response);
  console.log("loading, error, data ", loading, error, data);

  useEffect(() => {
    if (open) clear();
  }, [open]);

  const clear = () => {
    setShowScene(scene.pinPad);
    setPin(null);
    setSelectedRecord(null);
  };

  const handleClose = useCallback(() => onClose(), [onClose]);
  /**
   *
   */
  const handlePinSubmit = useCallback(({ record, pin }) => {
    setPin(pin);
    setSelectedRecord(record);
    setShowScene(scene.photoAndNote);
  }, []);
  /**
   *
   */
  const handleClockInSubmit = useCallback(
    ({ photoBlob, note }) => {
      console.log(pin, selectedRecord, photoBlob, note);
      const { id, companyId } = selectedRecord;
      const fileName = `accts/${companyId}/time-imgs/${uuidv4()}.png`;
      uploadImg(fileName, photoBlob);
      const input = {
        quickPunchId: id,
        base64Ident: btoa(pin),
        photo: fileName,
        note,
      };

      punchIn({ variables: { input } });

      setShowScene(scene.loading);
    },
    [pin, punchIn, selectedRecord, uploadImg]
  );

  const getScene = useCallback(
    (s) => {
      switch (s) {
        case scene.loading:
          return (
            <LoadingDialog
              open={open}
              onClose={handleClose}
              title="Loading"
              message="Clocking you in/out, please wait..."
            />
          );
        case scene.photoAndNote:
          return (
            <ClockinDialogTwo
              open={open}
              onClose={handleClose}
              onSubmit={handleClockInSubmit}
            />
          );
        case scene.pinPad:
        default:
          return (
            <EnterPinDialog
              open={open}
              pinRecords={pinRecords}
              onClose={handleClose}
              onSubmit={handlePinSubmit}
            />
          );
      }
    },
    [handleClockInSubmit, handleClose, handlePinSubmit, open, pinRecords]
  );

  return getScene(showScene);
};

PinClockInDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pinRecords: PropTypes.array.isRequired,
};

export default PinClockInDialog;
