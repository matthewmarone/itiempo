import React, { useContext, useState } from "react";
import { Context } from "Store";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
} from "@material-ui/core";
import {
  TimeCardTable,
  ClockInButton,
  DateFilter,
  AddTimeButton,
} from "components";
import { getWorkWeek, formateDate } from "helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  clockInBody: {
    minHeight: 110,
  },
  verse: {
    paddingLeft: theme.spacing(1),
  },
  timeTableContainer: {
    maxWidth: 800,
    // minWidth: 335,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  addTimeButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 *
 */
const Home = () => {
  const classes = useStyles();
  const [{ user }] = useContext(Context);
  const { companyId, employeeId } = user || {};
  const [openAddTime, setOpenAddTime] = useState(false);

  const [{ fromDate, toDate }, setFilterState] = useState({
    fromDate: formateDate(getWorkWeek().fromDate),
    toDate: formateDate(),
  });

  const handleTimeTableFilterChange = React.useCallback(
    (e) => {
      setFilterState({ fromDate, toDate, [e.target.name]: e.target.value });
    },
    [fromDate, toDate]
  );

  return (
    <div className={classes.root} id="homeRoot">
      <Grid container spacing={4} justify="center">
        <Grid item sm={4} xs={12}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h3">
                Welcome!
              </Typography>
            </CardContent>
            <Divider />
            <CardActions style={{ textAlign: "right" }}>
              <ClockInButton employeeId={employeeId} />
              <AddTimeButton
                open={openAddTime}
                onClose={() => setOpenAddTime(false)}
              >
                <Button
                  className={classes.addTimeButton}
                  color="secondary"
                  variant="outlined"
                  onClick={() => setOpenAddTime(true)}
                >
                  Add Time
                </Button>
              </AddTimeButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs>
          <div className={classes.timeTableContainer}>
            <Card>
              <CardContent>
                <DateFilter
                  onChange={handleTimeTableFilterChange}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </CardContent>
            </Card>
            <div className={classes.tableContainer}>
              <TimeCardTable
                singleEmployee
                companyId={companyId}
                employeeIds={[employeeId]}
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
