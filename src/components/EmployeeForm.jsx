import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function EmployeeForm({ defaultValues, onSubmit, onCancel, departments, positions, locations, managers }) {
  const buildDefaults = useCallback(
    (values) => ({
      ...values,
      department_id: values?.department_id ? String(values.department_id) : '',
      position_id: values?.position_id ? String(values.position_id) : '',
      manager_id: values?.manager_id ? String(values.manager_id) : '',
      location_id: values?.location_id ? String(values.location_id) : '',
      create_portal_account:
        values?.create_portal_account === true || values?.create_portal_account === 'true'
          ? 'true'
          : 'false'
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: buildDefaults(defaultValues)
  });

  useEffect(() => {
    reset(buildDefaults(defaultValues));
  }, [defaultValues, reset, buildDefaults]);

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__grid">
        <label>
          <span>First name</span>
          <input {...register('first_name', { required: 'Required' })} />
          {errors.first_name && <small>{errors.first_name.message}</small>}
        </label>
        <label>
          <span>Last name</span>
          <input {...register('last_name', { required: 'Required' })} />
          {errors.last_name && <small>{errors.last_name.message}</small>}
        </label>
        <label>
          <span>Gender</span>
          <select {...register('gender', { required: 'Required' })}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <small>{errors.gender.message}</small>}
        </label>
        <label>
          <span>Birth date</span>
          <input type="date" {...register('birth_date')} />
        </label>
        <label>
          <span>National ID</span>
          <input {...register('national_id')} />
        </label>
        <label>
          <span>Work email</span>
          <input type="email" {...register('work_email', { required: 'Required' })} />
          {errors.work_email && <small>{errors.work_email.message}</small>}
        </label>
        <label>
          <span>Personal email</span>
          <input type="email" {...register('personal_email')} />
        </label>
        <label>
          <span>Phone</span>
          <input {...register('phone')} />
        </label>
        <label className="form__span-2">
          <span>Address</span>
          <input {...register('address')} />
        </label>
        <label>
          <span>Department</span>
          <select {...register('department_id', { required: 'Required' })}>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {errors.department_id && <small>{errors.department_id.message}</small>}
        </label>
        <label>
          <span>Position</span>
          <select {...register('position_id', { required: 'Required' })}>
            <option value="">Select position</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
          {errors.position_id && <small>{errors.position_id.message}</small>}
        </label>
        <label>
          <span>Manager</span>
          <select {...register('manager_id')}>
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.full_name || manager.first_name + ' ' + manager.last_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Job level</span>
          <select {...register('job_level')}>
            <option value="">Select level</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </label>
        <label>
          <span>Location</span>
          <select {...register('location_id')}>
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Hire date</span>
          <input type="date" {...register('hire_date')} />
        </label>
        <label>
          <span>Create portal account</span>
          <select {...register('create_portal_account')}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </label>
        <label>
          <span>Portal username</span>
          <input {...register('portal_username')} />
        </label>
        <label>
          <span>Portal password</span>
          <input type="password" {...register('portal_password')} autoComplete="new-password" />
        </label>
        <label>
          <span>Confirm portal password</span>
          <input
            type="password"
            {...register('portal_password_confirmation')}
            autoComplete="new-password"
          />
        </label>
      </div>
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Save employee
        </button>
      </div>
    </form>
  );
}

EmployeeForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(PropTypes.object),
  positions: PropTypes.arrayOf(PropTypes.object),
  locations: PropTypes.arrayOf(PropTypes.object),
  managers: PropTypes.arrayOf(PropTypes.object)
};

EmployeeForm.defaultProps = {
  defaultValues: {},
  departments: [],
  positions: [],
  locations: [],
  managers: []
};

export default EmployeeForm;
