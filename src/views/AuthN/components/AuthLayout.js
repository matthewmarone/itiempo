import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from "@material-ui/core";
import { Minimal } from "layouts";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
  },
  grid: {
    height: "100%",
  },
  verseContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  verse: {
    backgroundColor: theme.palette.neutral,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/images/auth.jpg)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  verseInner: {
    textAlign: "center",
    flexBasis: "600px",
  },
  verseText: {
    color: theme.palette.white,
    fontWeight: 300,
  },
  verseReference: {},
  verseReferenceText: {
    marginTop: theme.spacing(3),
    color: theme.palette.white,
  },
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentHeader: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  contentBody: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
  },
}));

const AuthLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <Minimal>
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.verseContainer} item lg={5}>
            <div className={classes.verse}>
              <div className={classes.verseInner}>
                <Typography className={classes.verseText} variant="h1">
                  "For God so loved the world that he gave his one and only Son,
                  that whoever believes in him shall not perish but have eternal
                  life."
                </Typography>
                <div className={classes.verseReference}>
                  <Typography
                    className={classes.verseReferenceText}
                    variant="body1"
                  >
                    ~ John 3:16
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <img
                  alt="iTiempo Graphic"
                  src="/images/logos/Logo Text Small.png"
                />
              </div>
              <div className={classes.contentBody}>{children}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    </Minimal>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};

export default AuthLayout;
