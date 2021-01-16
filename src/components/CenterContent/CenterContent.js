import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    height: "100%",
    width: "100%",
  },
  grid: {
    height: "100%",
    width: "100%",
  },
  content: {
    alignSelf: "center",
  },
}));

/**
 *
 * @param {*} param0
 */
const CenterContent = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid className={classes.content} item xs>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default CenterContent;
