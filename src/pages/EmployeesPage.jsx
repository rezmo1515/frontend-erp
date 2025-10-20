import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Modal from '../components/Modal.jsx';
import EmployeeForm from '../components/EmployeeForm.jsx';
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee
} from '../api/employees.js';
import { fetchDepartments } from '../api/departments.js';
import { fetchPositions } from '../api/positions.js';

const locationsMock = [
  { id: 1, name: 'Tehran HQ' },
  { id: 2, name: 'Mashhad Office' },
  { id: 3, name: 'Remote' }
];

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [employeeRecords, departmentRecords, positionRecords] = await Promise.all([
          fetchEmployees(filters),
          fetchDepartments(),
          fetchPositions()
        ]);
        setEmployees(employeeRecords);
        setDepartments(departmentRecords);
        setPositions(positionRecords);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleSubmit = async (formValues) => {
    const payload = {
      ...formValues,
      department_id: Number(formValues.department_id) || null,
      position_id: Number(formValues.position_id) || null,
      manager_id: formValues.manager_id ? Number(formValues.manager_id) : null,
      location_id: formValues.location_id ? Number(formValues.location_id) : null,
      create_portal_account:
        formValues.create_portal_account === true || formValues.create_portal_account === 'true'
    };

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, payload);
      } else {
        await createEmployee(payload);
      }
      setShowModal(false);
      setFilters((prev) => ({ ...prev }));
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.first_name} ${employee.last_name}?`)) return;
    try {
      await deleteEmployee(employee.id);
      setFilters((prev) => ({ ...prev }));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const filterConfig = useMemo(
    () => [
      { name: 'first_name', label: 'First name', type: 'text', value: filters.first_name || '' },
      { name: 'last_name', label: 'Last name', type: 'text', value: filters.last_name || '' },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        value: filters.gender || '',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        name: 'department_id',
        label: 'Department',
        type: 'select',
        value: filters.department_id || '',
        options: departments.map((department) => ({ label: department.name, value: department.id }))
      },
      {
        name: 'position_id',
        label: 'Position',
        type: 'select',
        value: filters.position_id || '',
        options: positions.map((position) => ({ label: position.name, value: position.id }))
      },
      {
        name: 'location_id',
        label: 'Location',
        type: 'select',
        value: filters.location_id || '',
        options: locationsMock.map((location) => ({ label: location.name, value: location.id }))
      },
      {
        name: 'profile_completed',
        label: 'Profile completed',
        type: 'select',
        value: filters.profile_completed || '',
        options: [
          { label: 'Yes', value: '1' },
          { label: 'No', value: '0' }
        ]
      }
    ],
    [filters, departments, positions]
  );

  const columns = [
    { label: 'Code', key: 'employee_code' },
    { label: 'Name', render: (row) => `${row.first_name} ${row.last_name}` },
    { label: 'Gender', key: 'gender' },
    { label: 'Work email', key: 'work_email' },
    { label: 'Department', render: (row) => row.department?.name || row.department_id },
    { label: 'Position', render: (row) => row.position?.name || row.position_id },
    {
      label: 'Profile completed',
      render: (row) => (row.profile_completed ? 'Yes' : 'No')
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
      <Card title="Employees" action={<button className="btn btn--primary" onClick={handleCreate}>Add employee</button>}>
        <FilterBar filters={filterConfig} onChange={handleFilterChange} onReset={handleResetFilters} />
        {loading && <p>Loading employees…</p>}
        {error && <p className="text-error">{error}</p>}
        <DataTable columns={columns} data={employees} />
      </Card>
      <Modal
        open={showModal}
        title={editingEmployee ? 'Edit employee' : 'Add employee'}
        onClose={() => setShowModal(false)}
      >
        <EmployeeForm
          defaultValues={
            editingEmployee || {
              first_name: '',
              last_name: '',
              gender: '',
              birth_date: '',
              national_id: '',
              work_email: '',
              personal_email: '',
              phone: '',
              address: '',
              department_id: '',
              position_id: '',
              manager_id: '',
              job_level: '',
              location_id: '',
              hire_date: '',
              create_portal_account: false,
              portal_username: '',
              portal_password: '',
              portal_password_confirmation: ''
            }
          }
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          departments={departments}
          positions={positions}
          locations={locationsMock}
          managers={employees}
        />
      </Modal>
    </div>
  );
}

export default EmployeesPage;
