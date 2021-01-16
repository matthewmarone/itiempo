import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import PropTypes from 'prop-types';
const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

const ContinuousSlider = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.value || 30);
  const { handleChange, handleChangeCommitted } = props;

  const handleChangeInternal = (event, newValue) => {
    setValue(newValue);
    if(handleChange){handleChange(newValue);}
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <ZoomOutIcon fontSize='small' color='primary'/>
        </Grid>
        <Grid item xs>
          <Slider 
            value={value} 
            onChange={handleChangeInternal}
            onChangeCommitted={handleChangeCommitted}
            aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <ZoomInIcon fontSize='small' color='primary' />
        </Grid>
      </Grid>
    </div>
  );
};

ContinuousSlider.propTypes = {
    handleChange: PropTypes.func,
    handleChangeCommitted: PropTypes.func,
    value: PropTypes.number,
};

export default ContinuousSlider;