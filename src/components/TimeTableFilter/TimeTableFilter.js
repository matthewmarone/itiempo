import React, { useContext, useState } from "react";
import { Context } from "Store";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Chip,
  TextField,
  Button,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AvatarMenuItem, Avatar, AddTimeButton } from "components";
import { getWorkWeek, formateDate } from "helpers";
import { DateFilter } from "components";
import { useListEmployeesByEmail } from "hooks";

const useStyles = makeStyles((theme) => ({
  addTimeButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 *
 * @param {*} props
 */
const TimeTableFilter = (props) => {
  const classes = useStyles();
  const { onFilterUpdate, initialState = {} } = props;
  const [openAddTime, setOpenAddTime] = useState(false);
  const {
    selectedEmployees: se = [],
    fromDate: fd = formateDate(getWorkWeek().fromDate),
    toDate: td = formateDate(),
  } = initialState;

  const [{ user }] = useContext(Context);
  const { companyId } = user || {};
  const { data } = useListEmployeesByEmail(companyId);
  const { listEmployeesByEmail: { items: employees } = {} } = data || {};
  const [selectedEmployees, setSelectedEmployees] = useState(se);
  const [selectedDates, setSelectedDates] = useState({
    fromDate: fd,
    toDate: td,
  });

  const handleDateChange = React.useCallback(
    (e) => {
      setSelectedDates({ ...selectedDates, [e.target.name]: e.target.value });
    },
    [selectedDates]
  );

  const { fromDate, toDate } = selectedDates;

  const handleFilterUpdate = React.useCallback(() => {
    if (typeof onFilterUpdate === "function")
      onFilterUpdate({
        selectedEmployees: [...(selectedEmployees || [])],
        ...selectedDates,
      });
  }, [onFilterUpdate, selectedDates, selectedEmployees]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="select-employee-supervisor"
              options={employees || []}
              getOptionLabel={(option) =>
                option.firstName + " " + option.lastName
              }
              onChange={(event, value, reason) => {
                if (value) setSelectedEmployees(value);
              }}
              renderTags={(value, getTagProps) => {
                return value.map((option, index) => {
                  const { firstName, lastName, profilePhoto } = option;
                  return (
                    <Chip
                      label={firstName + " " + lastName}
                      avatar={<Avatar {...{ firstName, profilePhoto }} />}
                      color="secondary"
                      {...getTagProps({ index })}
                    />
                  );
                });
              }}
              renderOption={(option, { selected }) => (
                <AvatarMenuItem {...option} isSelected={selected} />
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedEmployees.length > 0
                      ? "Employee"
                      : "Select Employee(s)"
                  }
                  variant="outlined"
                  placeholder="Select employees to include"
                />
              )}
            />
          </Grid>
          <DateFilter
            fromDate={fromDate}
            toDate={toDate}
            onChange={handleDateChange}
          />
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className=""
          color="primary"
          variant="text"
          onClick={handleFilterUpdate}
        >
          Update report
        </Button>
        <AddTimeButton open={openAddTime} onClose={() => setOpenAddTime(false)}>
          <Button
            className={classes.addTimeButton}
            color="primary"
            variant="text"
            onClick={() => setOpenAddTime(true)}
          >
            Add Time
          </Button>
        </AddTimeButton>
      </CardActions>
    </Card>
  );
};

export default TimeTableFilter;
