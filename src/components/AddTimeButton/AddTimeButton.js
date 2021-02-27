import React, { useState, useCallback } from "react";
import { default as TimeRecordEdit } from "../TimeRecordEdit";
import PropTypes from "prop-types";

// const useStyles = makeStyles({
//   imageSize: { maxHeight: "175px" },
// });

/**
 *
 * @param {*} props
 */
const AddTimeButton = (props) => {
  const { open, onClose, children } = props;
  const [saving, setSaving] = useState(false);

  const handleClose = useCallback(() => {
    // Stops closing the dialog in mid save
    if (!saving) onClose();
  }, [onClose, saving]);

  const handleSaving = useCallback((s) => {
    setSaving(s);
  }, []);

  return (
    <React.Fragment>
      {children}
      <TimeRecordEdit
        open={open}
        onClose={handleClose}
        onSaving={handleSaving}
      />
    </React.Fragment>
  );
};

AddTimeButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTimeButton;
