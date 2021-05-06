import React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
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

  const isError =
    errorMessage && errorMessage.length > 0 && (!pin || pin.length === 0);

  const createStars = (p, star = "*") => {
    let retVal = "";
    for (let i = 0; i < p.length; i++) retVal = retVal.concat(star);
    return retVal;
  };

  const stars =
    pin && pin.length > 0
      ? createStars(pin)
      : hint && hint.length > 0
      ? hint
      : "Enter Pin";

  return (
    <Grid
      container
      spacing={spacing}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography color={isError ? "error" : "textPrimary"} variant="body1">
          {isError ? errorMessage : stars}
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
          color="primary"
          variant="contained"
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
