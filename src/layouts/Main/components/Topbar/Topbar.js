import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Hidden, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
// import InputIcon from '@material-ui/icons/Input';
// import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  flexGrow: {
    flexGrow: 1,
  },
  routerLink: {
    color: "inherit",
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  image: {
    height: "1.175em",
  },
}));

const Topbar = (props) => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  // const [notifications] = useState([]);

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="/images/logos/iTiempo - White.svg"
            className={classes.image}
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        {/* <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <RouterLink 
            to="/logout" 
            className={clsx(classes.routerLink, className)}
          >
            <IconButton
              className={classes.signOutButton}
              color="inherit"
            >
              <InputIcon />
            </IconButton>
          </RouterLink>
        </Hidden> */}
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
};

export default Topbar;
