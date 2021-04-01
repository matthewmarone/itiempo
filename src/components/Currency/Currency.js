import PropTypes from "prop-types";

const Currency = (props) => {
  const { amount } = props;
  const fAmount = (parseFloat(`${amount}`) || 0).toFixed(2);

  return `$${fAmount}`;
};
Currency.propTypes = {
  amount: PropTypes.any,
};

export default Currency;
