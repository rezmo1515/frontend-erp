import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Card from '../components/Card.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { fetchEmployees } from '../api/employees.js';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const records = await fetchEmployees();
        setEmployees(records);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalEmployees = employees.length;
  const completedProfiles = employees.filter((employee) => employee.profile_completed).length;
  const completionRate = totalEmployees
    ? Math.round((completedProfiles / totalEmployees) * 100)
    : 0;
  const latestHire = employees
    .filter((employee) => employee.hire_date)
    .map((employee) => dayjs(employee.hire_date))
    .sort((a, b) => b.valueOf() - a.valueOf())[0];

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatsCard label="Total employees" value={totalEmployees} />
        <StatsCard label="Profiles completed" value={completedProfiles} trend={`${completionRate}%`} />
        <StatsCard label="Latest hire" value={latestHire ? latestHire.format('YYYY-MM-DD') : '—'} />
      </div>
      <Card title="Recent employees">
        {loading && <p>Loading employees…</p>}
        {error && <p className="text-error">{error}</p>}
        {!loading && !error && (
          <ul className="timeline">
            {employees.slice(0, 5).map((employee) => (
              <li key={employee.id} className="timeline__item">
                <div>
                  <strong>
                    {employee.first_name} {employee.last_name}
                  </strong>
                  <span className="timeline__muted">{employee.work_email}</span>
                </div>
                <span className="timeline__date">
                  {employee.hire_date ? dayjs(employee.hire_date).format('YYYY-MM-DD') : '—'}
                </span>
              </li>
            ))}
            {employees.length === 0 && <li className="timeline__empty">No employees yet.</li>}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
