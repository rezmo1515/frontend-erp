import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import RoleForm from '../components/RoleForm.jsx';
import { assignRoleToEmployee, createRole, deleteRole, fetchRoles, updateRole } from '../api/roles.js';
import { fetchEmployees } from '../api/employees.js';

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [roleData, employeeData] = await Promise.all([fetchRoles(), fetchEmployees()]);
      setRoles(roleData);
      setEmployees(employeeData);
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
    setCurrent(null);
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setCurrent(role);
    setShowModal(true);
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Delete role ${role.name}?`)) return;
    try {
      await deleteRole(role.id);
      load();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      permissions: values.permissions || []
    };
    try {
      if (current?.id) {
        await updateRole(current.id, payload);
      } else {
        await createRole(payload);
      }
      setShowModal(false);
      load();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    if (!selectedEmployee || !selectedRole) return;
    setAssigning(true);
    try {
      await assignRoleToEmployee(Number(selectedEmployee), { role_id: Number(selectedRole) });
      setSelectedEmployee('');
      setSelectedRole('');
      setError(null);
    } catch (assignError) {
      setError(assignError.message);
    } finally {
      setAssigning(false);
    }
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Description', key: 'description' },
    {
      label: 'Permissions',
      render: (row) => (
        <ul className="pill-list">
          {(row.permissions || []).map((permission) => (
            <li key={permission} className="pill">
              {permission}
            </li>
          ))}
          {(!row.permissions || row.permissions.length === 0) && (
            <li className="pill pill--muted">No permissions</li>
          )}
        </ul>
      )
    },
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
      <Card title="Roles & permissions" action={<button className="btn btn--primary" onClick={handleCreate}>New role</button>}>
        {loading && <p>Loading roles…</p>}
        {error && <p className="text-error">{error}</p>}
        <DataTable columns={columns} data={roles} />
        <div className="assignment">
          <h3>Assign role to employee</h3>
          <form className="assignment__form" onSubmit={handleAssign}>
            <select value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)}>
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn--primary" disabled={assigning}>
              {assigning ? 'Assigning…' : 'Assign role'}
            </button>
          </form>
        </div>
      </Card>
      <Modal
        open={showModal}
        title={current?.id ? 'Edit role' : 'New role'}
        onClose={() => setShowModal(false)}
      >
        <RoleForm
          defaultValues={
            current || {
              name: '',
              description: '',
              permissions: []
            }
          }
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default RolesPage;
