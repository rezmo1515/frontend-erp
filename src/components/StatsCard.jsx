import PropTypes from 'prop-types';

function StatsCard({ label, value, trend }) {
  return (
    <article className="stats-card">
      <span className="stats-card__label">{label}</span>
      <strong className="stats-card__value">{value}</strong>
      {trend && <span className="stats-card__trend">{trend}</span>}
    </article>
  );
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.string
};

StatsCard.defaultProps = {
  trend: null
};

export default StatsCard;
