import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuthContext } from '../store/store';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);

    const load = async () => {
      try {
        setLoading(true);
        const [cats, usrs] = await Promise.all([
          apiClient.get('/categorias'),
          apiClient.get('/usuarios'),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setUsers(Array.isArray(usrs) ? usrs : []);
      } catch (err) {
        setError(err?.message || 'Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        String(c.nome || '').toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const activeCategories = categories.filter((c) => c.ativa !== false).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-wrapper" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--persona-red)', letterSpacing: '0.18em', marginBottom: 6 }}>
            // VISÃO GERAL
          </div>
          <h1 className="section-title">
            PAINEL {user ? `· ${user.nomeCompleto?.toUpperCase() || ''}` : ''}
          </h1>
        </div>
        <button
          className="btn-ghost"
          onClick={handleLogout}
          style={{ padding: '8px 16px', marginTop: 8 }}
        >
          SAIR
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'CATEGORIAS', value: categories.length },
          { label: 'ATIVAS', value: activeCategories },
          { label: 'USUÁRIOS', value: users.length },
        ].map((s, index) => (
          <div
            key={s.label}
            style={{
              background: 'var(--persona-card)',
              border: '1px solid var(--persona-border)',
              borderLeft: '4px solid var(--persona-red)',
              padding: '14px 18px',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
              opacity: 0,
              animation: mounted ? `slideInUp 0.4s ${0.05 + index * 0.08}s ease both` : 'none',
            }}
          >
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', color: 'var(--persona-red)', lineHeight: 1 }}>
              {loading ? '...' : s.value}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)', letterSpacing: '0.1em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20, opacity: 0, animation: mounted ? 'slideInLeft 0.4s 0.2s ease both' : 'none' }}>
        <input
          className="p-input"
          placeholder="Buscar categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {error ? (
        <div style={{
          marginBottom: 20, padding: 14,
          border: '1px solid rgba(230,57,70,0.35)',
          background: 'rgba(230,57,70,0.08)',
          color: 'var(--persona-white)',
        }}>
          ⚠ {error}
        </div>
      ) : null}

      {loading ? (
        <div style={{ color: 'var(--persona-gray)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', padding: '20px 0' }}>
          Carregando dados...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          {filtered.map((category, index) => (
            <div
              key={category.id}
              style={{
                background: 'var(--persona-card)',
                border: '1px solid var(--persona-border)',
                borderLeft: `4px solid ${category.cor || 'var(--persona-red)'}`,
                padding: '18px',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                opacity: 0,
                animation: mounted ? `slideInUp 0.4s ${0.1 + index * 0.06}s ease both` : 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/categorias')}
            >
              {category.cor && (
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: category.cor, marginBottom: 8 }} />
              )}
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--persona-white)', marginBottom: 4 }}>
                {category.nome}
              </div>
              {category.descricao && (
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: 'var(--persona-gray)', marginBottom: 6 }}>
                  {category.descricao}
                </div>
              )}
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)' }}>
                ID #{category.id} · {category.ativa !== false ? 'ATIVA' : 'INATIVA'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
