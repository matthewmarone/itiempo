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
  const [showingActiveUsers, setShowingActiveUsers] = useState(true);

  // Handler for show inactive/active employee button
  const handleInactiveUserButtonClick = useCallback(() => {
    setShowingActiveUsers((v) => !v);
  }, []);

  // State for UsersToolBar
  const [usrSearchStr, setUserSearchStr] = useState("");
  const handleSearchStrChange = useCallback(
    ({ target: { value } }) => setUserSearchStr(value),
    []
  );

  const employees = useMemo(
    () =>
      (items || [])
        .filter((i) => {
          // Filter by show active/inactive toggle
          const active = !i.inactive; // null is considered active
          return active === showingActiveUsers;
        })
        .filter((i) => {
          // Filter by text search if applicable
          const stringFilter = usrSearchStr?.trim().toLowerCase();
          if (stringFilter) {
            const str = `${i.firstName} ${i.lastName}`;
            return str.toLowerCase().includes(stringFilter);
          } else {
            return true;
          }
        }),
    [items, usrSearchStr, showingActiveUsers]
  );

  return (
    <div className={classes.root}>
      <UsersToolbar
        searchValue={usrSearchStr}
        onSearchChange={handleSearchStrChange}
        showingActiveUsers={showingActiveUsers}
        onInactiveUserButtonClick={handleInactiveUserButtonClick}
      />
      <div className={classes.content}>
        <UsersTable employees={employees} />
      </div>
    </div>
  );
};

export default EmployeeList;
