import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EmployeesPage from './pages/EmployeesPage.jsx';
import DepartmentsPage from './pages/DepartmentsPage.jsx';
import PositionsPage from './pages/PositionsPage.jsx';
import RolesPage from './pages/RolesPage.jsx';
import Layout from './components/Layout.jsx';
import { useAuth } from './hooks/useAuth.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="roles" element={<RolesPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
