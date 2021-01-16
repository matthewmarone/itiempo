import React, { useContext } from "react";
import { Context } from "Store";
import { makeStyles } from "@material-ui/styles";
import { UsersToolbar, UsersTable } from "./components";
import { Logger } from "aws-amplify";
import { useListEmployeesByEmail } from "hooks";

// eslint-disable-next-line
const logger = new Logger("UserList.js", "ERROR");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const EmployeeList = () => {
  const classes = useStyles();
  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const { data } = useListEmployeesByEmail(companyId);
  const { listEmployeesByEmail: { items: employees } = {} } = data || {};

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable employees={employees || []} />
      </div>
    </div>
  );
};

export default EmployeeList;
