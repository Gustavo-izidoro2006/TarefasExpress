import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';

export const Header = ({ sidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [glitch, setGlitch] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 8000);

    const nome = authService.getCurrentUser()?.nomeCompleto || '';
    setUserName(nome);

    return () => clearInterval(iv);
  }, []);

  const routeNames = {
    '/':              'DASHBOARD',
    '/dashboard':     'DASHBOARD',
    '/grupos':        'GRUPOS',
    '/categorias':    'CATEGORIAS',
    '/notificacoes':  'NOTIFICAÇÕES',
    '/relatorios':    'RELATÓRIOS',
    '/configuracoes': 'CONFIGURAÇÕES',
    '/perfil':        'PERFIL',
  };

  const currentRoute = Object.entries(routeNames).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  );
  const pageName = currentRoute ? currentRoute[1] : 'TAREFA EXPRESS';

  return (
    <header
      className="app-header"
      style={{ left: sidebarOpen && window.innerWidth >= 768 ? 260 : 0 }}
    >
      <div className="app-header__left">
        {/* Botão hambúrguer — abre/fecha sidebar */}
        <button
          className="header-toggle-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Recolher menu' : 'Abrir menu'}
          aria-label="Toggle sidebar"
        >
          <span className={`hamburger ${sidebarOpen ? 'hamburger--open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>

        <div className="app-header__divider" />

        <span
          className="app-header__page-name"
          style={{
            animation: glitch ? 'glitch 0.2s steps(1) infinite' : 'none',
            textShadow: glitch
              ? '2px 0 var(--p4-gold), -2px 0 var(--p4-white)'
              : 'none',
          }}
        >
          {pageName}
        </span>
      </div>

      <div className="app-header__right">
        <span className="app-header__date">
          {new Date()
            .toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
            })
            .toUpperCase()}
        </span>

        {userName && (
          <span className="app-header__user">{userName}</span>
        )}

        <button
          className="btn-ghost"
          onClick={() => navigate('/configuracoes')}
          style={{ padding: '6px 10px', fontSize: '1rem', lineHeight: 1 }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--p4-gold)';
            e.currentTarget.style.color = 'var(--p4-gold)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--p4-border)';
            e.currentTarget.style.color = 'var(--p4-gray)';
          }}
        >
          ⚙
        </button>
      </div>
    </header>
  );
};
