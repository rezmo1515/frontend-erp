import PropTypes from 'prop-types';

function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <label key={filter.name} className="filter-bar__field">
          <span>{filter.label}</span>
          {filter.type === 'select' ? (
            <select
              name={filter.name}
              value={filter.value || ''}
              onChange={(event) => onChange(filter.name, event.target.value)}
            >
              <option value="">All</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={filter.name}
              value={filter.value || ''}
              onChange={(event) => onChange(filter.name, event.target.value)}
              placeholder={filter.placeholder || ''}
            />
          )}
        </label>
      ))}
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'select']),
      options: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, label: PropTypes.string.isRequired })
      ),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default FilterBar;
