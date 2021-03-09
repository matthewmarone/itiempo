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
import { Logger } from "aws-amplify";
import {
  TimeCardTable,
  ClockInButton,
  DateFilter,
  AddTimeButton,
} from "components";
import { getWorkWeek, formateDate } from "helpers";

// eslint-disable-next-line no-unused-vars
const logger = new Logger("Home.js", "ERROR");

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
  logger.debug("Context.user", user, companyId, employeeId);
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
              <div className={classes.clockInBody}>
                <Typography gutterBottom variant="h3">
                  Welcome!
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Word of the Day,
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  gutterBottom
                  className={classes.verse}
                >
                  <i>
                    For God so loved the world that he gave his one and only
                    Son, that whoever believes in him shall not perish but have
                    eternal life.
                  </i>
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={classes.verse}
                >
                  ~ John 3:16
                </Typography>
              </div>
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
                  color="primary"
                  variant="text"
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
