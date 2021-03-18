import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { isDigits } from "helpers";
import { default as PinPad } from "../../PinPad";
import { useCreateQuickPunch as useCreate, useGetEmployee } from "hooks";

/**
 *
 * @param {*} props
 */
const EnterPinDialog = (props) => {
  const { open, onClose } = props;
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const isValidPin = (p) => isDigits(p) && p.length > 3;

  const createOrUpdatePin = (p) => {
    console.log(btoa(p));
  };

  const handlePinChange = (v) => {
    if (isDigits(v) || v === "") setPin(v);
  };
  const handlePinSubmit = () => {
    if (isValidPin(pin)) {
      createOrUpdatePin(pin);
    }
  };
  const handleClose = () => onClose();

  const clear = (errMsg) => {
    setPin("");
    setErrorMessage(errMsg);
  };

  useEffect(() => {
    if (open) clear();
  }, [open]);

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title="Quick Clock"
      dialogContent={
        <PinPad
          pin={pin}
          onChange={handlePinChange}
          onSubmit={handlePinSubmit}
          errorMessage={errorMessage}
          valid={isValidPin(pin)}
        />
      }
      actions={[
        <Button key="cancel" autoFocus onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    />
  );
};

EnterPinDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EnterPinDialog;
