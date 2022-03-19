import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { SearchInput } from "components";
import { Button } from "@material-ui/core";
import { I18n } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {},
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  secondaryButton: {
    marginRight: theme.spacing(1),
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
}));

const UsersToolbar = (props) => {
  const {
    className,
    onChange,
    searchValue,
    onSearchChange,
    showingActiveUsers,
    onInactiveUserButtonClick,
    ...rest
  } = props;
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        {/* <Button className={classes.secondaryButton}>Show Inactive</Button> */}
        <Button
          color="primary"
          variant="outlined"
          className={classes.secondaryButton}
          onClick={onInactiveUserButtonClick}
        >
          {I18n.get(`Show ${showingActiveUsers ? "Inactive" : "Active"}`)}
        </Button>
        {/* <Button
          color="primary"
          variant="contained"
          onClick={()=>{}}
        >
          Deactivate
        </Button> */}
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder={I18n.get("Search employees")}
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  showingActiveUsers: PropTypes.bool.isRequired,
  onInactiveUserButtonClick: PropTypes.func.isRequired,
};

export default UsersToolbar;
