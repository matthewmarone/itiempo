import React from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import PropTypes from "prop-types";

/**
 *
 * @param {*} props
 */
const PinPad = (props) => {
  const { pin, onChange, onSubmit, errorMessage, valid, hint } = props;
  const spacing = 2;
  const color = "primary";
  const variant = "outlined";
  const size = "large";

  const createRow = (values = []) =>
    values.map((v) => (
      <Grid item key={v}>
        <Button
          color={color}
          variant={variant}
          size={size}
          onClick={() => onChange(`${pin || ""}${v}`)}
        >
          {v}
        </Button>
      </Grid>
    ));

  const handleBack = () => {
    if (pin.length > 0) onChange(pin.substring(0, pin.length - 1));
  };

  return (
    <Grid
      container
      spacing={spacing}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <TextField
          type="password"
          value={pin}
          label={hint}
          onChange={({ target: { value } }) => {
            onChange(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography color="error" variant="body1">
          {errorMessage || ""}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={spacing}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {createRow([1, 2, 3])}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={spacing}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {createRow([4, 5, 6])}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={spacing}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {createRow([7, 8, 9])}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={spacing}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Button color="default" onClick={() => onChange("")}>
              Clear
            </Button>
          </Grid>
          {createRow([0])}
          <Grid item>
            <Button color="default" onClick={handleBack}>
              Del
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="secondary"
          size={size}
          disabled={!valid}
          onClick={onSubmit}
        >
          Enter
        </Button>
      </Grid>
    </Grid>
  );
};
PinPad.propTypes = {
  pin: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  hint: PropTypes.string,
  valid: PropTypes.bool.isRequired,
};

export default PinPad;
