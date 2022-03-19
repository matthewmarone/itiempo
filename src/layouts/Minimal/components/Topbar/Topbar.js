import React, { useContext, useCallback } from "react";
import { Context } from "Store";
import { AppActions } from "Reducer";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import { I18n } from "aws-amplify";

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none",
  },
  image: {
    height: "1.175em",
  },
  langBtn: {
    color: "white",
  },
  flexGrow: {
    flexGrow: 1,
  },
}));

const Topbar = (props) => {
  const { className, ...rest } = props;
  const [{ lang }, dispatch] = useContext(Context);
  const classes = useStyles();

  const changeLanguage = useCallback(() => {
    dispatch({
      type: AppActions.CHANGE_LANG,
      payload: { lang: lang === "en" ? "es" : "en" },
    });
  }, [dispatch, lang]);

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <img
          alt={I18n.get("Logo")}
          src="/images/logos/iTiempo - White.svg"
          className={classes.image}
        />
        <div className={classes.flexGrow} />
        <Button
          size="small"
          startIcon={<TranslateIcon />}
          color="primary"
          classes={{ textPrimary: classes.langBtn }}
          onClick={changeLanguage}
        >
          {lang === "es" ? "English" : "Español"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
