import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/api';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados da tarefa
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [venceEm, setVenceEm] = useState('');
  const [concluida, setConcluida] = useState(false);
  const [idGrupo, setIdGrupo] = useState('');

  useEffect(() => {
    setMounted(true);
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const t = await apiClient.get(`/tarefas/${id}`);
        setTitulo(t.titulo || '');
        setDescricao(t.desc || '');
        setPrioridade(t.prioridade || 'Média');
        setConcluida(!!t.concluida);
        setIdGrupo(t.idGrupo || '');
        if (t.venceEm) {
          // Formata data ISO para o input datetime-local (YYYY-MM-DDTHH:mm)
          const date = new Date(t.venceEm);
          const offset = date.getTimezoneOffset();
          const localDate = new Date(date.getTime() - offset * 60 * 1000);
          setVenceEm(localDate.toISOString().slice(0, 16));
        } else {
          setVenceEm('');
        }
      } catch (err) {
        setError(err?.message || 'Erro ao carregar detalhes da tarefa.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      setError('');
      setSuccess('');
      await apiClient.put(`/tarefas/${id}`, {
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        prioridade,
        venceEm: venceEm ? new Date(venceEm).toISOString() : null,
        concluida,
      });
      setSuccess('Tarefa atualizada com sucesso!');
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar tarefa.');
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('Deseja realmente excluir esta tarefa?');
    if (!ok) return;

    try {
      setError('');
      await apiClient.delete(`/tarefas/${id}`);
      navigate(-1);
    } catch (err) {
      setError(err?.message || 'Erro ao excluir tarefa.');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ padding: 24, color: 'var(--p4-gray)' }}>
        Carregando detalhes da tarefa...
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost">← VOLTAR</button>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gold)', letterSpacing: '0.18em' }}>
            // DETALHE DA TAREFA
          </div>
          <div className="section-title" style={{ fontSize: '1.8rem', marginTop: 4 }}>
            EDITAR TAREFA
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Formulário de Edição */}
        <div style={{
          background: 'var(--p4-card)',
          border: '1px solid var(--p4-border)',
          padding: 24,
          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)',
          opacity: 0,
          animation: mounted ? 'fadeIn 0.4s ease both' : 'none',
        }}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 6 }}>
                TÍTULO DA TAREFA
              </label>
              <input
                className="p-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 6 }}>
                DESCRIÇÃO
              </label>
              <textarea
                className="p-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={{ width: '100%', minHeight: 100, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 6 }}>
                  PRIORIDADE
                </label>
                <select
                  className="p-input"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  style={{ width: '100%', background: 'var(--p4-dark)', color: 'var(--p4-white)', border: '1px solid var(--p4-border)' }}
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div>
                <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 6 }}>
                  PRAZO
                </label>
                <input
                  type="datetime-local"
                  className="p-input"
                  value={venceEm}
                  onChange={(e) => setVenceEm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <input
                type="checkbox"
                id="concluida"
                checked={concluida}
                onChange={(e) => setConcluida(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--p4-gold)' }}
              />
              <label htmlFor="concluida" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--p4-white)', fontWeight: 700, cursor: 'pointer' }}>
                MARCAR COMO CONCLUÍDA
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn-persona" type="submit" style={{ flex: 1 }}>
                SALVAR ALTERAÇÕES
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate(-1)}
                style={{ flex: 1 }}
              >
                CANCELAR
              </button>
            </div>
          </form>

          {success && (
            <div style={{ color: 'var(--p4-green)', fontFamily: 'Rajdhani, sans-serif', marginTop: 12, fontWeight: 'bold' }}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div style={{ color: 'var(--p4-gold)', fontFamily: 'Rajdhani, sans-serif', marginTop: 12 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Sidebar de Ações */}
        <div style={{
          background: 'var(--p4-card)',
          border: '1px solid var(--p4-border)',
          borderLeft: '4px solid var(--p4-gold)',
          padding: 18,
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', marginBottom: 12 }}>
            // ZONA DE PERIGO
          </div>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--p4-gray)', fontSize: '0.85rem', marginBottom: 16 }}>
            A exclusão da tarefa é permanente e não poderá ser desfeita. Todos os dados associados a esta tarefa serão removidos do sistema.
          </p>
          <button
            onClick={handleDelete}
            className="btn-persona"
            style={{ width: '100%', background: 'linear-gradient(135deg, #d90429, #ef233c)', border: 'none', color: '#fff' }}
          >
            EXCLUIR TAREFA
          </button>
        </div>
      </div>
    </div>
  );
};
