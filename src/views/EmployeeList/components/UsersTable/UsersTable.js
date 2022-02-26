import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { getInitials } from "helpers";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { AddEmployeeDialog } from "components";
import { useDownloadImage } from "hooks";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
  },
  nameContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: "flex-end",
  },
  buttonContainer: {
    display: "flex",
    height: "100%",
  },
  buttonText: {
    padding: "none",
  },
  spinner: {
    position: "absolute",
    // top: "50%",
    left: "50%",
    textAlign: "center",
  },
  loadingCell: { height: 73, border: "none" },
}));

const NameContainer = (props) => {
  const { classes, employee } = props;
  const { profilePhoto: key } = employee;
  const [setVars, { data: avatarUrl }] = useDownloadImage({ key });
  useEffect(() => {
    setVars({ key });
  }, [key, setVars]);

  return (
    <div className={classes.nameContainer}>
      <Avatar className={classes.avatar} src={avatarUrl}>
        {getInitials(employee.firstName + " " + employee.lastName)}
      </Avatar>
      <Typography variant="body1">
        <Link component={RouterLink} to={"/employees/" + employee.id}>
          {employee.firstName + " " + employee.lastName}
        </Link>
      </Typography>
    </div>
  );
};
/**
 *
 * @param {*} props
 * @returns
 */
const UsersTable = (props) => {
  const { className, employees, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSelectAll = (event) => {
    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = employees.map((user) => user.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const firstUserIndex = page * rowsPerPage;
  const lastUserIndex =
    firstUserIndex + rowsPerPage > employees.length
      ? employees.length
      : firstUserIndex + rowsPerPage;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === employees.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < employees.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow className={classes.tableRow} hover>
                    <TableCell
                      padding="checkbox"
                      colSpan={4}
                      className={classes.loadingCell}
                    >
                      <Checkbox color="primary" />
                      <CircularProgress
                        color="secondary"
                        className={classes.spinner}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.slice(firstUserIndex, lastUserIndex).map((user) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedUsers.indexOf(user.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedUsers.indexOf(user.id) !== -1}
                          color="primary"
                          onChange={(event) => handleSelectOne(event, user.id)}
                          value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <NameContainer classes={classes} employee={user} />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.roles && user.roles[0]
                          ? user.roles[0]
                          : "Employee"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid container justify="center">
          <Grid item sm={3} xs={12}>
            <div className={classes.buttonContainer}>
              <Button
                classes={{ text: classes.buttonText }}
                color="primary"
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Add Employee
              </Button>
            </div>
          </Grid>
          <Grid item sm xs={12}>
            <TablePagination
              component="div"
              count={employees.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Grid>
        </Grid>
        <AddEmployeeDialog open={open} onClose={() => setOpen(false)} />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  employees: PropTypes.array.isRequired,
};

export default UsersTable;
