import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../store/store';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',     path: '/dashboard',     icon: '⬡' },
  { id: 'groups',       label: 'Grupos',         path: '/grupos',        icon: '◈' },
  { id: 'categories',   label: 'Categorias',     path: '/categorias',    icon: '◆' },
  { id: 'notifications',label: 'Notificações',   path: '/notificacoes',  icon: '◉' },
  { id: 'reports',      label: 'Relatórios',     path: '/relatorios',    icon: '▦' },
  { id: 'settings',     label: 'Configurações',  path: '/configuracoes', icon: '⚙' },
];

export const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNav = (path) => {
    navigate(path);
    // fecha no mobile ao navegar
    if (window.innerWidth < 768) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // iniciais do nome para o avatar
  const initials = user?.nomeCompleto
    ? user.nomeCompleto.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}>
      {/* barra de cor no topo */}
      <div className="sidebar__top-bar" />

      {/* Logo + botão fechar */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">✓</div>
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-title">TAREFA</span>
          <span className="sidebar__logo-subtitle">EXPRESS</span>
        </div>
        {/* botão recolher — visível em desktop */}
        <button
          className="sidebar__collapse-btn"
          onClick={onClose}
          title="Recolher menu"
        >
          ◀
        </button>
      </div>

      {/* Usuário */}
      <div
        className="sidebar__user"
        onClick={() => handleNav('/perfil')}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleNav('/perfil')}
      >
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">
            {user?.nomeCompleto || ''}
          </span>
          <span className="sidebar__user-email">
            {user?.email || ''}
          </span>
        </div>
        <span className="status-online" />
      </div>

      {/* Label navegação */}
      <div className="sidebar__nav-label">NAVEGAÇÃO</div>

      {/* Itens de navegação */}
      <nav className="sidebar__nav">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.path)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className={`sidebar__nav-item ${isActive(item.path) ? 'sidebar__nav-item--active' : ''}`}
            style={{
              opacity: 0,
              animation: mounted
                ? `slideInLeft 0.35s ${0.16 + index * 0.04}s ease both`
                : 'none',
            }}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span
              className="sidebar__nav-label-text"
              style={{
                color: isActive(item.path) || hovered === item.id
                  ? 'var(--p4-white)'
                  : 'var(--p4-gray)',
              }}
            >
              {item.label}
            </span>
            {isActive(item.path) && <span className="sidebar__nav-active-dot" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar__footer">
        <button
          className="sidebar__logout-btn"
          onClick={handleLogout}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245,197,24,0.12)';
            e.currentTarget.style.color = 'var(--p4-white)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245,197,24,0.05)';
            e.currentTarget.style.color = 'var(--p4-gray)';
          }}
        >
          <span>⏻</span>
          <span>SAIR</span>
        </button>
      </div>
    </aside>
  );
};
