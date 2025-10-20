import PropTypes from 'prop-types';

function DataTable({ columns, data, emptyMessage }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.label}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row.id || row.key}>
              {columns.map((column) => (
                <td key={column.key || column.label}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string
};

DataTable.defaultProps = {
  emptyMessage: 'No records found.'
};

export default DataTable;
