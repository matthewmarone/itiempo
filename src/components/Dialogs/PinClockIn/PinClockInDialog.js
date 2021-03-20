import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { default as EnterPinDialog } from "../EnterPin";
/**
 *
 * @param {*} props
 */
const PinClockInDialog = (props) => {
  const { open, onClose, pinRecords } = props;

  const handleClose = useCallback(() => onClose(), [onClose]);
  const handleValidate = useCallback((e) => console.log(e), []);

  return (
    <EnterPinDialog
      open={open}
      pinRecords={pinRecords}
      onClose={handleClose}
      onValidate={handleValidate}
    />
  );
};

PinClockInDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pinRecords: PropTypes.array.isRequired,
};

export default PinClockInDialog;
