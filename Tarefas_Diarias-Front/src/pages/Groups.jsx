import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuthContext } from '../store/store';

export const Groups = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Estados para entrar em grupo com código
  const [inviteCode, setInviteCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinError, setJoinError] = useState('');

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.get('/grupos');
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Groups] GET /grupos failed:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });
      setError(err?.message || 'Não foi possível carregar os grupos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    if (!user?.id) {
      setError('Usuário não identificado. Faça login novamente.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setMessage('');
      await apiClient.post('/grupos', {
        Nome: nome.trim(),
        Descricao: descricao.trim() || null,
        Tipo: 4, // Personalizado (enum TipoGrupo)
        IdUsuarioCriador: user.id,
      });
      setNome('');
      setDescricao('');
      setMessage('Grupo criado com sucesso!');
      await loadGroups();
    } catch (err) {
      console.error('[Groups] POST /grupos failed:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });
      setError(err?.message || 'Não foi possível criar o grupo.');
    } finally {
      setSaving(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    if (!user?.id) {
      setJoinError('Usuário não identificado. Faça login novamente.');
      return;
    }
    try {
      setJoining(true);
      setJoinError('');
      setJoinMessage('');
      const res = await apiClient.post('/convites/aceitar', {
        codigo: inviteCode.trim().toUpperCase(),
        idUsuario: user.id,
      });
      setInviteCode('');
      setJoinMessage(res?.message || 'Entrou no grupo com sucesso!');
      await loadGroups();
    } catch (err) {
      console.error('[Groups] POST /convites/aceitar failed:', {
        status: err?.status,
        data: err?.data,
        message: err?.message,
      });
      setJoinError(err?.message || 'Não foi possível entrar no grupo.');
    } finally {
      setJoining(false);
    }
  };

  const tipoLabel = (tipo) => {
    const map = { 1: 'Empresa', 2: 'Escola', 3: 'Casa', 4: 'Personalizado' };
    return map[tipo] || 'Grupo';
  };

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--persona-red)', letterSpacing: '0.18em', marginBottom: 6 }}>
          // GRUPOS DO SISTEMA
        </div>
        <div className="section-title">GRUPOS</div>
      </div>

      {/* Formulários de Grupo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 20,
        opacity: 0,
        animation: mounted ? 'slideInUp 0.4s 0.1s ease both' : 'none',
      }}>
        {/* Form criar grupo */}
        <div style={{
          background: 'var(--persona-card)',
          border: '1px solid var(--persona-border)',
          borderLeft: '4px solid var(--persona-blue)',
          padding: 18,
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--persona-gray)', marginBottom: 12 }}>
            // CRIAR NOVO GRUPO
          </div>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              className="p-input"
              placeholder="Nome do grupo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{ width: '100%' }}
            />
            <input
              className="p-input"
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ width: '100%' }}
            />
            <button className="btn-persona" type="submit" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'CRIANDO...' : '+ NOVO GRUPO'}
            </button>
          </form>
          {message && <div style={{ color: 'var(--persona-green)', marginTop: 8, fontFamily: 'Rajdhani, sans-serif' }}>{message}</div>}
          {error && <div style={{ color: 'var(--persona-red)', marginTop: 8, fontFamily: 'Rajdhani, sans-serif' }}>⚠ {error}</div>}
        </div>

        {/* Form participar com código */}
        <div style={{
          background: 'var(--persona-card)',
          border: '1px solid var(--persona-border)',
          borderLeft: '4px solid var(--persona-yellow)',
          padding: 18,
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--persona-gray)', marginBottom: 12 }}>
              // PARTICIPAR DE UM GRUPO
            </div>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                className="p-input"
                placeholder="Código de convite (ex: AB12C3)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <div style={{ height: 42 }} /> {/* Spacer */}
              <button
                className="btn-persona"
                type="submit"
                disabled={joining}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--persona-yellow), #f5a623)',
                  border: 'none',
                  color: '#000'
                }}
              >
                {joining ? 'ENTRANDO...' : 'ENTRAR NO GRUPO'}
              </button>
            </form>
          </div>
          {joinMessage && <div style={{ color: 'var(--persona-green)', marginTop: 8, fontFamily: 'Rajdhani, sans-serif' }}>{joinMessage}</div>}
          {joinError && <div style={{ color: 'var(--persona-red)', marginTop: 8, fontFamily: 'Rajdhani, sans-serif' }}>⚠ {joinError}</div>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {[
          { label: 'TOTAL DE GRUPOS', value: grupos.length },
          { label: 'CARREGANDO', value: loading ? '...' : 'PRONTO' },
        ].map((item, index) => (
          <div key={item.label} style={{
            background: 'var(--persona-card)',
            border: '1px solid var(--persona-border)',
            borderLeft: '4px solid var(--persona-red)',
            padding: '14px 18px',
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            opacity: 0,
            animation: mounted ? `slideInUp 0.4s ${0.15 + index * 0.06}s ease both` : 'none',
          }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--persona-red)', lineHeight: 1 }}>
              {item.value}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de grupos */}
      {loading ? (
        <div style={{ color: 'var(--persona-gray)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', padding: 18 }}>
          Carregando grupos...
        </div>
      ) : grupos.length === 0 ? (
        <div style={{
          background: 'var(--persona-card)',
          border: '1px solid var(--persona-border)',
          borderLeft: '4px solid var(--persona-yellow)',
          padding: 18,
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        }}>
          <p style={{ color: 'var(--persona-gray)', margin: 0, fontFamily: 'Rajdhani, sans-serif' }}>
            Nenhum grupo encontrado. Crie o primeiro grupo acima!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {grupos.map((g, i) => (
            <div
              key={g.id}
              onClick={() => navigate(`/grupos/${g.id}`)}
              style={{
                background: 'var(--persona-card)',
                border: '1px solid var(--persona-border)',
                borderLeft: '4px solid var(--persona-blue)',
                padding: '18px',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                cursor: 'pointer',
                opacity: 0,
                animation: mounted ? `slideInUp 0.4s ${0.08 + i * 0.05}s ease both` : 'none',
              }}
            >
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--persona-white)', marginBottom: 4 }}>
                {g.nome}
              </div>
              {g.descricao && (
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: 'var(--persona-gray)', marginBottom: 8 }}>
                  {g.descricao}
                </div>
              )}
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-blue)' }}>
                {tipoLabel(g.tipo)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
