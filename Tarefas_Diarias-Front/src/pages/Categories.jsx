import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api';

export const Categories = () => {
  const [mounted, setMounted] = useState(false);
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.get('/categorias');
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Categories] GET /categorias failed:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });
      setError(err?.message || 'Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadCategories();
  }, []);

  const activeCount = useMemo(
    () => categorias.filter((c) => c.ativa !== false).length,
    [categorias]
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');
      await apiClient.post('/categorias', { Nome: nome.trim(), Ativa: true });
      setNome('');
      setMessage('Categoria criada com sucesso.');
      await loadCategories();
    } catch (err) {
      console.error('[Categories] POST /categorias failed:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });
      setError(err?.message || 'Não foi possível criar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Deseja excluir esta categoria?');
    if (!ok) return;

    try {
      await apiClient.delete(`/categorias/${id}`);
      setMessage('Categoria removida.');
      await loadCategories();
    } catch (err) {
      setError(err?.message || 'Não foi possível excluir a categoria.');
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--persona-red)', letterSpacing: '0.18em', marginBottom: 6 }}>
          // GERENCIAR CATEGORIAS
        </div>
        <div className="section-title">CATEGORIAS</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'TOTAL', value: categorias.length },
          { label: 'ATIVAS', value: activeCount },
          { label: 'INATIVAS', value: categorias.length - activeCount },
        ].map((item, index) => (
          <div
            key={item.label}
            style={{
              background: 'var(--persona-card)',
              border: '1px solid var(--persona-border)',
              borderLeft: '4px solid var(--persona-red)',
              padding: '14px 18px',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
              opacity: 0,
              animation: mounted ? `slideInUp 0.4s ${0.05 + index * 0.06}s ease both` : 'none',
            }}
          >
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--persona-red)', lineHeight: 1 }}>
              {loading ? '...' : item.value}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          className="p-input"
          placeholder="Nova categoria (ex: Financeiro)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ flex: '1 1 280px' }}
        />
        <button className="btn-persona" type="submit" disabled={saving} style={{ minWidth: 170 }}>
          {saving ? 'SALVANDO...' : '+ NOVA CATEGORIA'}
        </button>
      </form>

      {message ? (
        <div style={{ marginBottom: 14, color: 'var(--persona-green)' }}>{message}</div>
      ) : null}
      {error ? (
        <div style={{ marginBottom: 14, color: 'var(--persona-red)' }}>{error}</div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {categorias.map((c, i) => (
          <div
            key={c.id}
            style={{
              background: 'var(--persona-card)',
              border: '1px solid var(--persona-border)',
              borderLeft: `4px solid ${c.ativa === false ? 'var(--persona-gray)' : 'var(--persona-red)'}`,
              padding: '18px',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
              opacity: 0,
              animation: mounted ? `slideInUp 0.4s ${0.08 + i * 0.05}s ease both` : 'none',
            }}
          >
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--persona-white)', marginBottom: 8 }}>
              {c.nome}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)', marginBottom: 10 }}>
              ID #{c.id}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ flex: 1, padding: '10px' }}
                onClick={() => handleDelete(c.id)}
              >
                EXCLUIR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
