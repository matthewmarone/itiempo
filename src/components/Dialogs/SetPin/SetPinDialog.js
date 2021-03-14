import React, { useState, useEffect, useContext } from "react";
import { Context } from "Store";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { DialogTemplate } from "../components";
import { isDigits } from "helpers";
import { default as PinPad } from "../../PinPad";
import { useCreateQuickPunch as useCreate, useGetEmployee } from "hooks";

const CreatPin = (props) => {
  const { input } = props;
  const [create, { loading, error, data }] = useCreate();

  useEffect(() => {
    if (input) create({ variables: { input } });
  }, [create, input]);

  return <span>Creating</span>;
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
  const [
    {
      user: { employeeId },
    },
  ] = useContext(Context);
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
          <CreatPin input={quickPunch} />
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
