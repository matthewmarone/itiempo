import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCounterFromMiliSeconds } from "helpers";

const td = (n) => {
  return `${n < 10 ? `0` : ``}${n}`;
};

/**
 *
 * @param {*} props
 * @returns
 */
const CountUp = (props) => {
  const { fromInSecond } = props;
  const [from, setFrom] = useState(() =>
    fromInSecond > 0 ? fromInSecond * 1000 : new Date().getTime()
  );
  const [now, setNow] = useState(() => new Date().getTime());

  useEffect(() => {
    const tId = window.setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);

    return () => window.clearInterval(tId);
  }, []);

  useEffect(() => {
    if (fromInSecond > 0) setFrom(fromInSecond * 1000);
  }, [fromInSecond]);

  const {
    days: dd,
    hours: hh,
    minutes: mm,
    seconds: ss,
  } = getCounterFromMiliSeconds(now - from);

  return `${dd > 0 ? td(dd) + ":" : ""}${td(hh)}:${td(mm)}.${td(ss)}`;
};
CountUp.propTypes = { fromInSecond: PropTypes.number };

export default CountUp;
