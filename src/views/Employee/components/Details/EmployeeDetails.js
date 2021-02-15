import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {},
}));

const EmployeeDetails = (props) => {
  const { className, employee, onSave, onChange, saving, ...rest } = props;
  const classes = useStyles();

  const {
    firstName,
    lastName,
    email,
    email_2,
    phone,
    phone_2,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    country,
  } = employee;

  const handleUserChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate>
        <CardHeader
          subheader="The information can be edited"
          title="Name & Contact Info"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="First name"
                margin="dense"
                name="firstName"
                onChange={handleUserChange}
                required
                value={firstName || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                margin="dense"
                name="lastName"
                onChange={handleUserChange}
                required
                value={lastName || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                margin="dense"
                name="email"
                disabled
                value={email || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Secondary Email"
                margin="dense"
                name="email_2"
                onChange={handleUserChange}
                value={email_2 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                margin="dense"
                name="phone"
                onChange={handleUserChange}
                type="text"
                value={phone || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Work Phone"
                margin="dense"
                name="phone_2"
                onChange={handleUserChange}
                value={phone_2 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <h5>Mailing Address:</h5>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                margin="dense"
                name="addressLine1"
                onChange={handleUserChange}
                value={addressLine1 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                margin="dense"
                name="addressLine2"
                onChange={handleUserChange}
                value={addressLine2 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="City"
                margin="dense"
                name="city"
                onChange={handleUserChange}
                value={city || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="State/Province/Region"
                margin="dense"
                name="state"
                onChange={handleUserChange}
                value={state || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Zip/Postal Code"
                margin="dense"
                name="zip"
                onChange={handleUserChange}
                value={zip || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Country"
                margin="dense"
                name="country"
                onChange={handleUserChange}
                value={country || ""}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={onSave}
            disabled={saving}
          >
            {!saving ? (
              "Save details"
            ) : (
              <CircularProgress color="secondary" size={28} />
            )}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

EmployeeDetails.propTypes = {
  className: PropTypes.string,
  employee: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default EmployeeDetails;
