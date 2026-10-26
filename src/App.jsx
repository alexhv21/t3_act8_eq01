import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';
import RecipesPage from './pages/RecipesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Todo lo que está aquí dentro requiere haber iniciado sesión */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="recetas" element={<RecipesPage />} />
          <Route
            path="usuarios"
            element={<PlaceholderPage title="Usuarios" description="Administra las cuentas de la comunidad." icon="users" />}
          />
          <Route
            path="estadisticas"
            element={<PlaceholderPage title="Estadísticas" description="Métricas de uso del recetario." icon="chart" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
