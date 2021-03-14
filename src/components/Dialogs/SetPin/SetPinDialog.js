import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { isDigits } from "helpers";
import { default as PinPad } from "../../PinPad";

const defaultTitle = "Set Pin";

/**
 *
 * @param {*} props
 */
const SetPinDialog = (props) => {
  const { open, onClose } = props;
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState(defaultTitle);

  const isValidPin = (p) => isDigits(p) && p.length > 3;

  const createOrUpdatePin = (p) => {
    clear();
    console.log("Creating pin", pin);
  };

  const handlePinChange = (v) => {
    if (isDigits(v) || v === "") setPin(v);
  };
  const handlePinSubmit = () => {
    if (isValidPin(pin)) {
      if (!firstPin) {
        setFirstPin(pin);
        setTitle("Confirm Pin");
        setPin("");
        setErrorMessage("");
      } else if (pin === firstPin) {
        createOrUpdatePin(firstPin);
      } else {
        clear("Pin did not match");
      }
    } else {
      clear("Invalid Pin");
    }
  };
  const handleClose = () => onClose();

  const clear = (errMsg) => {
    setPin("");
    setFirstPin(null);
    setErrorMessage(errMsg || null);
    setTitle(defaultTitle);
  };

  useEffect(() => {
    if (open) clear();
  }, [open]);

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title={title}
      dialogContent={
        <PinPad
          pin={pin}
          onChange={handlePinChange}
          onSubmit={handlePinSubmit}
          errorMessage={errorMessage}
          valid={isValidPin(pin)}
          hint={!firstPin ? undefined : "Re-enter pin"}
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

SetPinDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SetPinDialog;
