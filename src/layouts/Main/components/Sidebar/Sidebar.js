import React, { useContext, useCallback, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Divider, Drawer } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
// import DateRangeIcon from '@material-ui/icons/DateRange';
import TimelineIcon from "@material-ui/icons/Timeline";
import { Context } from "Store";
import { Profile, SidebarNav } from "./components";
import { Auth } from "aws-amplify";
import {
  useClockedIn,
  CLOCK_IN_STATE as cState,
  useGetEmployee,
  useDownloadImage,
} from "hooks";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 64px)",
    },
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));
/**
 *
 * @param {*} props
 */
const Sidebar = (props) => {
  const classes = useStyles();
  const { open, variant, onClose, className, ...rest } = props;
  const [{ user }] = useContext(Context);
  const { employeeId, roles = [] } = user || {};
  const profileURL = `/employees/${employeeId}`;
  const [clockedIn, setEmployeeId] = useClockedIn(employeeId);
  const [setEmployeeId2, { data }] = useGetEmployee(employeeId);
  const { getEmployee: employee } = data || {};
  const { profilePhoto: key } = employee || {};
  const [setKey, { data: avatarURL }] = useDownloadImage({ key });
  // Check if role includes more than employee
  const isNotEmployee =
    roles.findIndex((v) => v?.trim().length > 0 && v !== "Employee", []) >= 0;

  const handleLogout = useCallback(() => {
    Auth.signOut().catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    setEmployeeId(employeeId);
    setEmployeeId2(employeeId);
  }, [employeeId, setEmployeeId, setEmployeeId2]);

  useEffect(() => {
    setKey({ key });
  }, [key, setKey]);

  const pages = [
    {
      title: "Home",
      href: "/home",
      icon: <HomeIcon />,
    },
    // {
    //   title: "Profile",
    //   href: profileURL,
    //   icon: <PersonIcon />,
    // },
    // {
    //   title: "Employee",
    //   href: "/employees",
    //   icon: <PeopleIcon />,
    // },
    // {
    //   title: 'Schedule',
    //   href: '/schedule',
    //   icon: <DateRangeIcon />
    // },
    // {
    //   title: "Report",
    //   href: "/report",
    //   icon: <TimelineIcon />,
    // },
  ];

  if (isNotEmployee) {
    pages.push({
      title: "Employees",
      href: "/employees",
      icon: <PeopleIcon />,
    });
    pages.push({
      title: "Report",
      href: "/report",
      icon: <TimelineIcon />,
    });
  } else {
    pages.push({
      title: "Profile",
      href: profileURL,
      icon: <PersonIcon />,
    });
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile
          profileName={
            !employee
              ? "First Last Name"
              : `${employee.firstName} ${employee.lastName}`
          }
          profileURL={profileURL}
          avatarURL={avatarURL}
          clockedIn={clockedIn === cState.IN}
          onClose={onClose}
        />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
          onClose={onClose}
          onLogout={handleLogout}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default Sidebar;
