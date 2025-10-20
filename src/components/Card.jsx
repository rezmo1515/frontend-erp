import PropTypes from 'prop-types';

function Card({ title, action, children }) {
  return (
    <section className="card">
      <header className="card__header">
        <h2 className="card__title">{title}</h2>
        {action && <div className="card__action">{action}</div>}
      </header>
      <div className="card__body">{children}</div>
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.node,
  children: PropTypes.node.isRequired
};

Card.defaultProps = {
  action: null
};

export default Card;
