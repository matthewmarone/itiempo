import React, { useCallback, useContext, useMemo, useState } from "react";
import { Context } from "Store";
import { makeStyles } from "@material-ui/styles";
import { UsersToolbar, UsersTable } from "./components";
import { useListEmployeesByEmail } from "hooks";

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
  const { listEmployeesByEmail: { items } = {} } = data || {};

  // State for UsersToolBar
  const [usrSearchStr, setUserSearchStr] = useState("");
  const handleSearchStrChange = useCallback(
    ({ target: { value } }) => setUserSearchStr(value),
    []
  );

  const employees = useMemo(() => {
    if (usrSearchStr?.trim().length > 0) {
      return (items || []).filter((i) => {
        const str = `${i.firstName} ${i.lastName}`;
        return str.includes(usrSearchStr);
      });
    } else {
      return items || [];
    }
  }, [items, usrSearchStr]);

  return (
    <div className={classes.root}>
      <UsersToolbar
        searchValue={usrSearchStr}
        onSearchChange={handleSearchStrChange}
      />
      <div className={classes.content}>
        <UsersTable employees={employees} />
      </div>
    </div>
  );
};

export default EmployeeList;
