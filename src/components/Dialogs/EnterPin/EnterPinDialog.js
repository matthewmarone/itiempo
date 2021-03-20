import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { isDigits } from "helpers";
import { default as PinPad } from "../../PinPad";

/**
 *
 * @param {*} props
 */
const EnterPinDialog = (props) => {
  const { open, onClose, pinRecords, onValidate } = props;
  const [pin, setPin] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
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
        <Grid
          container
          spacing={4}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="pin-user-select">Name</InputLabel>
              <Select
                native
                value={selectedRecord || ""}
                onChange={({ target: { value } }) => setSelectedRecord(value)}
                inputProps={{
                  name: "name",
                  id: "pin-user-select",
                }}
                color="primary"
                size="large"
              >
                <option aria-label="None" value="" />
                {pinRecords.map(({ id, nickName }) => (
                  <option key={id} value={id}>
                    {nickName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <PinPad
              pin={pin}
              onChange={handlePinChange}
              onSubmit={handlePinSubmit}
              errorMessage={errorMessage}
              valid={
                !!(
                  isValidPin(pin) &&
                  selectedRecord &&
                  selectedRecord.length > 0
                )
              }
            />
          </Grid>
        </Grid>
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
  onValidate: PropTypes.func.isRequired,
  pinRecords: PropTypes.array.isRequired,
};

export default EnterPinDialog;
