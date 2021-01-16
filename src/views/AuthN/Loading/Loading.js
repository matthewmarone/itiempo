import React from "react";
// import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { Minimal } from "layouts";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
  },
  grid: {
    height: "100%",
  },
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentBody: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Loading = (props) => {
  const classes = useStyles();

  return (
    <Minimal>
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.content} item xs>
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <img
                  alt="iTiempo Graphic"
                  src="/images/logos/Logo Text Small.png"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </Minimal>
  );
};

Loading.propTypes = {};

export default Loading;
