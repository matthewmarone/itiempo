import React, { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "Store";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { isDigits } from "helpers";
import { default as PinPad } from "../../PinPad";
import { useCreateQuickPunch as useCreate, useGetEmployee } from "hooks";

const CreatPin = (props) => {
  const { input, onCreate, onError } = props;
  const [create, { loading, error, data }] = useCreate();

  useEffect(() => {
    if (input) create({ variables: { input } });
  }, [create, input]);

  useEffect(() => {
    if (!loading && (data?.createQP || error)) {
      !error ? onCreate(data.createQP) : onError(error);
    }
  }, [data, error, loading, onCreate, onError]);

  return (
    <div>
      <CircularProgress color="secondary" />
      <Typography variant="body1">Setting your pin, please wait...</Typography>
    </div>
  );
};
CreatPin.propTypes = {
  input: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const defaultTitle = "Set Pin";

/**
 *
 * @param {*} props
 */
const SetPinDialog = (props) => {
  const { open, onClose } = props;
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState(null);
  const [quickPunch, setQuickPunch] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [title, setTitle] = useState(defaultTitle);
  const [{ user }] = useContext(Context);
  const { employeeId } = user || {};
  const [setEmployeeId, { data }] = useGetEmployee(employeeId);
  const { getEmployee } = data || {};
  useEffect(() => {
    if (employeeId) setEmployeeId(employeeId);
  }, [employeeId, setEmployeeId]);

  const isValidPin = (p) => isDigits(p) && p.length > 3;

  const createOrUpdatePin = (p) => {
    const { id: employeeId, companyId, firstName, lastName } = getEmployee;
    setQuickPunch({
      companyId,
      employeeId,
      nickName: `${firstName} ${lastName}`,
      b64EncodedPin: btoa(p),
    });
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
    setQuickPunch(null);
  };

  useEffect(() => {
    if (open) clear();
  }, [open]);

  const handlePinCreate = useCallback((d) => onClose(), [onClose]);
  const handlePinCreateError = useCallback(
    (e) => clear("Error creating pin, please try again"),
    []
  );

  return (
    <DialogTemplate
      open={open}
      handleClose={onClose}
      title={title}
      dialogContent={
        !quickPunch ? (
          <PinPad
            pin={pin}
            onChange={handlePinChange}
            onSubmit={handlePinSubmit}
            errorMessage={errorMessage}
            valid={isValidPin(pin)}
            hint={!firstPin ? undefined : "Re-enter pin"}
          />
        ) : (
          <CreatPin
            input={quickPunch}
            onCreate={handlePinCreate}
            onError={handlePinCreateError}
          />
        )
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
