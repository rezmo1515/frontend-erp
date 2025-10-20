import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const PERMISSION_OPTIONS = [
  { label: 'View employees', value: 'employees.view' },
  { label: 'Create employees', value: 'employees.create' },
  { label: 'Edit employees', value: 'employees.update' },
  { label: 'Delete employees', value: 'employees.delete' },
  { label: 'Manage departments', value: 'departments.manage' },
  { label: 'Manage positions', value: 'positions.manage' },
  { label: 'Manage roles', value: 'roles.manage' }
];

function RoleForm({ defaultValues, onSubmit, onCancel }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__grid">
        <label className="form__span-2">
          <span>Name</span>
          <input {...register('name', { required: 'Required' })} />
        </label>
        <label className="form__span-2">
          <span>Description</span>
          <textarea rows="3" {...register('description')} />
        </label>
        <fieldset className="form__span-2">
          <legend>Permissions</legend>
          <div className="checkbox-grid">
            {PERMISSION_OPTIONS.map((permission) => (
              <label key={permission.value} className="checkbox">
                <input
                  type="checkbox"
                  value={permission.value}
                  {...register('permissions')}
                />
                <span>{permission.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Save role
        </button>
      </div>
    </form>
  );
}

RoleForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

RoleForm.defaultProps = {
  defaultValues: {
    name: '',
    description: '',
    permissions: []
  }
};

export default RoleForm;
