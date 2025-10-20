import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { createPosition, deletePosition, fetchPositions, updatePosition } from '../api/positions.js';
import { fetchDepartments } from '../api/departments.js';

const emptyPosition = {
  name: '',
  code: '',
  department_id: '',
  description: ''
};

function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyPosition);

  const load = async () => {
    setLoading(true);
    try {
      const [positionData, departmentData] = await Promise.all([
        fetchPositions(),
        fetchDepartments()
      ]);
      setPositions(positionData);
      setDepartments(departmentData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setCurrent(emptyPosition);
    setShowModal(true);
  };

  const handleEdit = (position) => {
    setCurrent({
      ...position,
      department_id: position.department_id || position.department?.id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (position) => {
    if (!window.confirm(`Delete position ${position.name}?`)) return;
    try {
      await deletePosition(position.id);
      load();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = {
      name: form.name.value,
      code: form.code.value,
      department_id: form.department_id.value ? Number(form.department_id.value) : null,
      description: form.description.value
    };
    try {
      if (current.id) {
        await updatePosition(current.id, payload);
      } else {
        await createPosition(payload);
      }
      setShowModal(false);
      load();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Code', key: 'code' },
    {
      label: 'Department',
      render: (row) =>
        row.department?.name || departments.find((dept) => dept.id === row.department_id)?.name || '—'
    },
    { label: 'Description', key: 'description' },
    {
      label: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <button type="button" className="btn btn--ghost" onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button type="button" className="btn btn--danger" onClick={() => handleDelete(row)}>
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page">
      <Card title="Positions" action={<button className="btn btn--primary" onClick={handleCreate}>New position</button>}>
        {loading && <p>Loading positions…</p>}
        {error && <p className="text-error">{error}</p>}
        <DataTable columns={columns} data={positions} />
      </Card>
      <Modal
        open={showModal}
        title={current.id ? 'Edit position' : 'New position'}
        onClose={() => setShowModal(false)}
      >
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__grid">
            <label className="form__span-2">
              <span>Name</span>
              <input name="name" defaultValue={current.name} required />
            </label>
            <label>
              <span>Code</span>
              <input name="code" defaultValue={current.code} required />
            </label>
            <label>
              <span>Department</span>
              <select name="department_id" defaultValue={current.department_id || ''}>
                <option value="">No department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form__span-2">
              <span>Description</span>
              <textarea name="description" rows="3" defaultValue={current.description} />
            </label>
          </div>
          <div className="form__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save position
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PositionsPage;
