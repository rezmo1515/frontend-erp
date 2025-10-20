import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from '../api/departments.js';

const emptyDepartment = {
  name: '',
  code: '',
  manager_id: '',
  description: ''
};

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyDepartment);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
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
    setCurrent(emptyDepartment);
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setCurrent({ ...department });
    setShowModal(true);
  };

  const handleDelete = async (department) => {
    if (!window.confirm(`Delete department ${department.name}?`)) return;
    try {
      await deleteDepartment(department.id);
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
      manager_id: form.manager_id.value ? Number(form.manager_id.value) : null,
      description: form.description.value
    };
    try {
      if (current.id) {
        await updateDepartment(current.id, payload);
      } else {
        await createDepartment(payload);
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
      label: 'Manager',
      render: (row) => row.manager?.full_name || row.manager_id || '—'
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
      <Card title="Departments" action={<button className="btn btn--primary" onClick={handleCreate}>New department</button>}>
        {loading && <p>Loading departments…</p>}
        {error && <p className="text-error">{error}</p>}
        <DataTable columns={columns} data={departments} />
      </Card>
      <Modal
        open={showModal}
        title={current.id ? 'Edit department' : 'New department'}
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
              <span>Manager ID</span>
              <input name="manager_id" defaultValue={current.manager_id || ''} />
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
              Save department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DepartmentsPage;
