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

const findSelectedPinRecord = (pinRecords, _id) =>
  (pinRecords || []).find(({ id }) => _id === id);

/**
 *
 * @param {*} props
 */
const EnterPinDialog = (props) => {
  const { open, onClose, pinRecords, onSubmit } = props;
  const [pin, setPin] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const isValidPin = (p) => isDigits(p) && p.length > 3;

  const handlePinChange = (v) => {
    if (isDigits(v) || v === "") setPin(v);
  };
  const handlePinSubmit = () => {
    const record = findSelectedPinRecord(pinRecords, selectedRecordId);
    if (record && isValidPin(pin)) {
      onSubmit({ record, pin });
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
                value={selectedRecordId || ""}
                onChange={({ target: { value } }) => setSelectedRecordId(value)}
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
                  selectedRecordId &&
                  selectedRecordId.length > 0
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
  onSubmit: PropTypes.func.isRequired,
  pinRecords: PropTypes.array.isRequired,
};

export default EnterPinDialog;
