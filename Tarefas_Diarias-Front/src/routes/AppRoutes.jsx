import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard,
  Login,
  Register,
  Groups,
  Categories,
  Notifications,
  Reports,
  Settings,
  Profile,
  TaskDetail,
  GroupDetail,
  NotFound,
} from '../pages';
import { MainLayout } from '../layouts/MainLayout';
import { useAuthContext } from '../store/store';

// Protege rotas: redireciona para /login se não autenticado
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Rota pública: redireciona para /dashboard se já autenticado
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Rota raiz → redireciona conforme autenticação
const RootRedirect = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rota raiz */}
        <Route path="/" element={<RootRedirect />} />

        {/* Rotas protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
        <Route path="/grupos" element={<PrivateRoute><MainLayout><Groups /></MainLayout></PrivateRoute>} />
        <Route path="/grupos/:id" element={<PrivateRoute><MainLayout><GroupDetail /></MainLayout></PrivateRoute>} />
        <Route path="/tarefas/:id" element={<PrivateRoute><MainLayout><TaskDetail /></MainLayout></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><MainLayout><Categories /></MainLayout></PrivateRoute>} />
        <Route path="/notificacoes" element={<PrivateRoute><MainLayout><Notifications /></MainLayout></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><MainLayout><Reports /></MainLayout></PrivateRoute>} />
        <Route path="/configuracoes" element={<PrivateRoute><MainLayout><Settings /></MainLayout></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><MainLayout><Profile /></MainLayout></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
