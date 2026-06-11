import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useAuthContext } from '../store/store';

export const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [mounted, setMounted] = useState(false);
  const [grupo, setGrupo] = useState(null);
  const [activeTab, setActiveTab] = useState('tarefas'); // 'tarefas' | 'membros' | 'chat' | 'convites'
  const [loadingGrupo, setLoadingGrupo] = useState(true);
  const [grupoError, setGrupoError] = useState('');

  // Estados de Tarefas
  const [tarefas, setTarefas] = useState([]);
  const [loadingTarefas, setLoadingTarefas] = useState(false);
  const [filtroTarefa, setFiltroTarefa] = useState('todas'); // 'todas' | 'incompletas' | 'concluidas'
  const [novaTarefaTitulo, setNovaTarefaTitulo] = useState('');
  const [novaTarefaDesc, setNovaTarefaDesc] = useState('');
  const [novaTarefaPrio, setNovaTarefaPrio] = useState('Média');
  const [novaTarefaPrazo, setNovaTarefaPrazo] = useState('');
  const [savingTarefa, setSavingTarefa] = useState(false);
  const [tarefaMessage, setTarefaMessage] = useState('');
  const [tarefaError, setTarefaError] = useState('');

  // Estados de Membros
  const [membros, setMembros] = useState([]);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [membroError, setMembroError] = useState('');

  // Estados de Chat
  const [chatMsgs, setChatMsgs] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Estados de Convites
  const [convites, setConvites] = useState([]);
  const [loadingConvites, setLoadingConvites] = useState(false);
  const [conviteEmail, setConviteEmail] = useState('');
  const [generatingConvite, setGeneratingConvite] = useState(false);
  const [conviteMessage, setConviteMessage] = useState('');
  const [conviteError, setConviteError] = useState('');

  // Carrega dados do grupo
  useEffect(() => {
    setMounted(true);
    const fetchGrupo = async () => {
      try {
        setLoadingGrupo(true);
        const data = await apiClient.get(`/grupos/${id}`);
        setGrupo(data);
      } catch (err) {
        setGrupoError(err?.message || 'Não foi possível carregar o grupo.');
      } finally {
        setLoadingGrupo(false);
      }
    };
    fetchGrupo();
  }, [id]);

  // Carrega os dados correspondentes à aba ativa
  useEffect(() => {
    if (!grupo) return;

    if (activeTab === 'tarefas') {
      loadTarefas();
    } else if (activeTab === 'membros') {
      loadMembros();
    } else if (activeTab === 'chat') {
      loadChat();
    } else if (activeTab === 'convites') {
      loadConvites();
    }
  }, [grupo, activeTab]);

  // Polling do chat para atualizar em tempo real a cada 3 segundos
  useEffect(() => {
    if (activeTab !== 'chat' || !grupo) return;

    const interval = setInterval(() => {
      refreshChatSilent();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab, grupo]);

  // Scroll do chat para o fim quando novas mensagens chegam
  useEffect(() => {
    if (activeTab === 'chat' && chatMsgs.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMsgs, activeTab]);

  // ─── OPERAÇÕES DE TAREFAS ────────────────────────────────────────────────

  const loadTarefas = async () => {
    try {
      setLoadingTarefas(true);
      setTarefaError('');
      const data = await apiClient.get(`/grupos/${id}/tarefas`);
      setTarefas(Array.isArray(data) ? data : []);
    } catch (err) {
      setTarefaError(err?.message || 'Falha ao buscar tarefas.');
    } finally {
      setLoadingTarefas(false);
    }
  };

  const handleCreateTarefa = async (e) => {
    e.preventDefault();
    if (!novaTarefaTitulo.trim()) return;

    try {
      setSavingTarefa(true);
      setTarefaError('');
      setTarefaMessage('');
      await apiClient.post(`/grupos/${id}/tarefas`, {
        titulo: novaTarefaTitulo.trim(),
        desc: novaTarefaDesc.trim() || null,
        prioridade: novaTarefaPrio,
        venceEm: novaTarefaPrazo ? new Date(novaTarefaPrazo).toISOString() : null,
        idUsuarioCriador: user?.id || Guid.empty,
      });

      setNovaTarefaTitulo('');
      setNovaTarefaDesc('');
      setNovaTarefaPrio('Média');
      setNovaTarefaPrazo('');
      setTarefaMessage('Tarefa criada com sucesso!');
      await loadTarefas();
    } catch (err) {
      setTarefaError(err?.message || 'Erro ao criar tarefa.');
    } finally {
      setSavingTarefa(false);
    }
  };

  const handleToggleTarefa = async (tarefaId, concluidaAtual) => {
    // Atualiza de forma otimista
    setTarefas((prev) =>
      prev.map((t) => (t.id === tarefaId ? { ...t, concluida: !concluidaAtual } : t))
    );

    try {
      await apiClient.put(`/tarefas/${tarefaId}`, {
        concluida: !concluidaAtual,
      });
    } catch (err) {
      console.error(err);
      // Reverte em caso de erro
      setTarefas((prev) =>
        prev.map((t) => (t.id === tarefaId ? { ...t, concluida: concluidaAtual } : t))
      );
    }
  };

  const filteredTarefas = tarefas.filter((t) => {
    if (filtroTarefa === 'incompletas') return !t.concluida;
    if (filtroTarefa === 'concluidas') return t.concluida;
    return true;
  });

  const getPrioColor = (prio) => {
    if (prio === 'Alta') return 'var(--p4-gold)';
    if (prio === 'Média') return 'var(--p4-gold)';
    return 'var(--p4-green)';
  };

  // ─── OPERAÇÕES DE MEMBROS ───────────────────────────────────────────────

  const loadMembros = async () => {
    try {
      setLoadingMembros(true);
      setMembroError('');
      const data = await apiClient.get(`/grupos/${id}/membros?userId=${user?.id}`);
      setMembros(Array.isArray(data) ? data : []);
    } catch (err) {
      setMembroError(err?.message || 'Falha ao buscar membros.');
    } finally {
      setLoadingMembros(false);
    }
  };

  // ─── OPERAÇÕES DE CHAT ──────────────────────────────────────────────────

  const loadChat = async () => {
    try {
      setLoadingChat(true);
      setChatError('');
      const data = await apiClient.get(`/grupos/${id}/chat?userId=${user?.id}`);
      setChatMsgs(Array.isArray(data) ? data : []);
    } catch (err) {
      setChatError(err?.message || 'Falha ao buscar mensagens.');
    } finally {
      setLoadingChat(false);
    }
  };

  const refreshChatSilent = async () => {
    try {
      const data = await apiClient.get(`/grupos/${id}/chat?userId=${user?.id}`);
      if (Array.isArray(data)) {
        setChatMsgs(data);
      }
    } catch (err) {
      console.warn('Erro ao atualizar chat:', err);
    }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || enviandoMsg) return;
    const text = msgInput.trim();
    setMsgInput('');

    // Mensagem otimista na tela
    const tempId = String(Date.now());
    const optimisticMsg = {
      id: tempId,
      autor: user?.nomeCompleto || 'Você',
      cargo: 'Membro',
      msg: text,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      meu: true,
    };
    setChatMsgs((prev) => [...prev, optimisticMsg]);

    try {
      setEnviandoMsg(true);
      await apiClient.post(`/grupos/${id}/chat`, {
        msg: text,
        userId: user?.id,
      });
      await refreshChatSilent();
    } catch (err) {
      console.error(err);
    } finally {
      setEnviandoMsg(false);
    }
  };

  // ─── OPERAÇÕES DE CONVITES ──────────────────────────────────────────────

  const loadConvites = async () => {
    try {
      setLoadingConvites(true);
      setConviteError('');
      const data = await apiClient.get(`/grupos/${id}/convites`);
      setConvites(Array.isArray(data) ? data : []);
    } catch (err) {
      setConviteError(err?.message || 'Falha ao buscar convites.');
    } finally {
      setLoadingConvites(false);
    }
  };

  const handleCreateConvite = async (e) => {
    e.preventDefault();
    try {
      setGeneratingConvite(true);
      setConviteError('');
      setConviteMessage('');
      const res = await apiClient.post(`/grupos/${id}/convites`, {
        email: conviteEmail.trim() || 'geral',
        idUsuarioConvidante: user?.id,
      });
      setConviteEmail('');
      setConviteMessage(`Convite criado! Código: ${res.codigo}`);
      await loadConvites();
    } catch (err) {
      setConviteError(err?.message || 'Falha ao gerar convite.');
    } finally {
      setGeneratingConvite(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────

  if (loadingGrupo) {
    return (
      <div className="page-wrapper" style={{ padding: 24, color: 'var(--p4-gray)' }}>
        Carregando informações do grupo...
      </div>
    );
  }

  if (grupoError || !grupo) {
    return (
      <div className="page-wrapper" style={{ padding: 24 }}>
        <button onClick={() => navigate('/grupos')} className="btn-ghost" style={{ marginBottom: 16 }}>← VOLTAR</button>
        <div style={{ color: 'var(--p4-gold)', fontFamily: 'Rajdhani, sans-serif' }}>
          ⚠ {grupoError || 'Grupo não encontrado.'}
        </div>
      </div>
    );
  }

  const mapTipoGrupo = { 1: 'Empresa', 2: 'Escola', 3: 'Familiar', 4: 'Personalizado' };

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      {/* Header do Grupo */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/grupos')} className="btn-ghost">← GRUPOS</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gold)', letterSpacing: '0.18em' }}>
            // GRUPO DE COLABORAÇÃO · {mapTipoGrupo[grupo.tipo]?.toUpperCase()}
          </div>
          <div className="section-title" style={{ fontSize: '2rem', marginTop: 4 }}>{grupo.nome}</div>
          {grupo.descricao && (
            <p style={{ color: 'var(--p4-gray)', fontFamily: 'Rajdhani, sans-serif', margin: '4px 0 0' }}>
              {grupo.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--p4-border)',
        marginBottom: 20,
        gap: 4,
      }}>
        {[
          { key: 'tarefas', label: '📋 TAREFAS' },
          { key: 'membros', label: '👥 MEMBROS' },
          { key: 'chat', label: '💬 CHAT' },
          { key: 'convites', label: '✉ CONVITES' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              background: activeTab === tab.key ? 'var(--p4-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid var(--p4-gold)' : '3px solid transparent',
              color: activeTab === tab.key ? 'var(--p4-white)' : 'var(--p4-gray)',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── CONTEÚDO DA ABA TAREFAS ─── */}
      {activeTab === 'tarefas' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'flex-start' }}>
            {/* Listagem */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: 'var(--p4-gray)' }}>
                  // TAREFAS ATIVAS
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['todas', 'incompletas', 'concluidas'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltroTarefa(f)}
                      className="btn-ghost"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        backgroundColor: filtroTarefa === f ? 'var(--p4-border)' : 'transparent',
                        color: filtroTarefa === f ? 'var(--p4-white)' : 'var(--p4-gray)',
                      }}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {loadingTarefas ? (
                <div style={{ color: 'var(--p4-gray)', padding: 20 }}>Carregando tarefas...</div>
              ) : filteredTarefas.length === 0 ? (
                <div style={{
                  background: 'var(--p4-card)',
                  border: '1px solid var(--p4-border)',
                  padding: 24,
                  textAlign: 'center',
                  color: 'var(--p4-gray)',
                  fontFamily: 'Rajdhani, sans-serif'
                }}>
                  Nenhuma tarefa nesta visualização.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {filteredTarefas.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        background: 'var(--p4-card)',
                        border: '1px solid var(--p4-border)',
                        borderLeft: `4px solid ${t.concluida ? 'var(--p4-green)' : getPrioColor(t.prioridade)}`,
                        padding: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={t.concluida}
                          onChange={() => handleToggleTarefa(t.id, t.concluida)}
                          style={{
                            width: 18,
                            height: 18,
                            cursor: 'pointer',
                            accentColor: 'var(--p4-gold)',
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontFamily: 'Rajdhani, sans-serif',
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: t.concluida ? 'var(--p4-gray)' : 'var(--p4-white)',
                              textDecoration: t.concluida ? 'line-through' : 'none',
                            }}
                          >
                            {t.titulo}
                          </div>
                          {t.desc && (
                            <div style={{ fontSize: '0.82rem', color: 'var(--p4-gray)', fontFamily: 'Rajdhani, sans-serif' }}>
                              {t.desc}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 10, marginTop: 4, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--p4-gray)' }}>
                            <span>PRIO: <span style={{ color: getPrioColor(t.prioridade) }}>{t.prioridade.toUpperCase()}</span></span>
                            {t.prazo && <span>LIMITE: {t.prazo} ({t.prazoRelativo})</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/tarefas/${t.id}`)}
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                      >
                        DETALHAR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Criar Tarefa */}
            <div style={{
              background: 'var(--p4-card)',
              border: '1px solid var(--p4-border)',
              padding: 16,
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', marginBottom: 12 }}>
                // ADICIONAR TAREFA
              </div>
              <form onSubmit={handleCreateTarefa} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <input
                    className="p-input"
                    placeholder="Título da tarefa"
                    value={novaTarefaTitulo}
                    onChange={(e) => setNovaTarefaTitulo(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <textarea
                    className="p-input"
                    placeholder="Descrição detalhada"
                    value={novaTarefaDesc}
                    onChange={(e) => setNovaTarefaDesc(e.target.value)}
                    style={{ width: '100%', minHeight: 60, resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: 'var(--p4-gray)' }}>PRIORIDADE</label>
                    <select
                      className="p-input"
                      value={novaTarefaPrio}
                      onChange={(e) => setNovaTarefaPrio(e.target.value)}
                      style={{ width: '100%', background: 'var(--p4-dark)', color: 'var(--p4-white)', border: '1px solid var(--p4-border)' }}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: 'var(--p4-gray)' }}>PRAZO</label>
                    <input
                      type="datetime-local"
                      className="p-input"
                      value={novaTarefaPrazo}
                      onChange={(e) => setNovaTarefaPrazo(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <button className="btn-persona" type="submit" disabled={savingTarefa} style={{ width: '100%' }}>
                  {savingTarefa ? 'SALVANDO...' : '+ CRIAR TAREFA'}
                </button>
              </form>
              {tarefaMessage && <div style={{ color: 'var(--p4-green)', marginTop: 8, fontSize: '0.85rem' }}>{tarefaMessage}</div>}
              {tarefaError && <div style={{ color: 'var(--p4-gold)', marginTop: 8, fontSize: '0.85rem' }}>⚠ {tarefaError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTEÚDO DA ABA MEMBROS ─── */}
      {activeTab === 'membros' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: 'var(--p4-gray)', marginBottom: 12 }}>
            // PARTICIPANTES DO GRUPO ({membros.length})
          </div>

          {loadingMembros ? (
            <div style={{ color: 'var(--p4-gray)', padding: 20 }}>Carregando membros...</div>
          ) : membroError ? (
            <div style={{ color: 'var(--p4-gold)', padding: 10 }}>⚠ {membroError}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {membros.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'var(--p4-card)',
                    border: '1px solid var(--p4-border)',
                    borderLeft: `4px solid ${m.isAdm ? 'var(--p4-gold)' : 'var(--p4-blue)'}`,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--p4-blue), var(--p4-dark))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Bebas Neue, sans-serif',
                      fontSize: '1.2rem',
                      color: 'var(--p4-white)',
                      border: '1px solid var(--p4-border)'
                    }}>
                      {m.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.98rem', color: 'var(--p4-white)' }}>
                        {m.nome} {m.voce && <span style={{ color: 'var(--p4-gold)', fontSize: '0.7rem' }}>(VOCÊ)</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--p4-gray)', fontFamily: 'Share Tech Mono, monospace' }}>
                        {m.cargo?.toUpperCase()} · {m.email}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.online ? 'var(--p4-green)' : 'var(--p4-gray)' }} />
                    <span style={{ fontSize: '0.65rem', fontFamily: 'Share Tech Mono, monospace', color: m.online ? 'var(--p4-green)' : 'var(--p4-gray)' }}>
                      {m.online ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── CONTEÚDO DA ABA CHAT ─── */}
      {activeTab === 'chat' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div style={{
            background: 'var(--p4-card)',
            border: '1px solid var(--p4-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '450px',
            clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)',
          }}>
            {/* Header do Chat */}
            <div style={{
              borderBottom: '1px solid var(--p4-border)',
              padding: '12px 16px',
              background: 'var(--p4-dark)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: 'var(--p4-gold)' }}>
                // CANAL DE COMUNICAÇÃO ATIVO
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--p4-gray)', fontFamily: 'Share Tech Mono, monospace' }}>
                🟢 ATUALIZAÇÃO AUTOMÁTICA
              </span>
            </div>

            {/* Mensagens */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {loadingChat ? (
                <div style={{ color: 'var(--p4-gray)' }}>Carregando histórico do chat...</div>
              ) : chatMsgs.length === 0 ? (
                <div style={{
                  color: 'var(--p4-gray)',
                  fontFamily: 'Rajdhani, sans-serif',
                  textAlign: 'center',
                  marginTop: 20
                }}>
                  Nenhuma mensagem ainda. Envie a primeira mensagem abaixo!
                </div>
              ) : (
                chatMsgs.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.meu ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      alignSelf: msg.meu ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!msg.meu && (
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--p4-gray)', marginBottom: 2 }}>
                        {msg.autor} · <span style={{ color: 'var(--p4-blue)' }}>{msg.cargo}</span>
                      </div>
                    )}
                    <div style={{
                      background: msg.meu ? 'var(--p4-gold)' : 'var(--p4-dark)',
                      border: '1px solid var(--p4-border)',
                      padding: '10px 14px',
                      borderRadius: 12,
                      borderTopRightRadius: msg.meu ? 0 : 12,
                      borderTopLeftRadius: msg.meu ? 12 : 0,
                      color: 'var(--p4-white)',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '0.92rem',
                      position: 'relative',
                    }}>
                      {msg.msg}
                      <span style={{
                        display: 'block',
                        fontSize: '0.6rem',
                        textAlign: 'right',
                        marginTop: 4,
                        opacity: 0.6,
                        fontFamily: 'Share Tech Mono, monospace',
                      }}>
                        {msg.hora}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMsg} style={{
              borderTop: '1px solid var(--p4-border)',
              padding: 12,
              background: 'var(--p4-dark)',
              display: 'flex',
              gap: 10,
            }}>
              <input
                className="p-input"
                placeholder="Digite sua mensagem e pressione Enter..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <button className="btn-persona" type="submit" disabled={enviandoMsg} style={{ minWidth: 100 }}>
                {enviandoMsg ? '...' : 'ENVIAR'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONTEÚDO DA ABA CONVITES ─── */}
      {activeTab === 'convites' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-start' }}>
            {/* Gerar Código */}
            <div style={{
              background: 'var(--p4-card)',
              border: '1px solid var(--p4-border)',
              padding: 18,
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', marginBottom: 12 }}>
                // GERAR NOVO CONVITE
              </div>
              <form onSubmit={handleCreateConvite} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 4 }}>
                    E-MAIL DO CONVIDADO (OPCIONAL)
                  </label>
                  <input
                    className="p-input"
                    placeholder="ex: amigo@email.com (ou deixe em branco para geral)"
                    value={conviteEmail}
                    onChange={(e) => setConviteEmail(e.target.value)}
                    type="email"
                    style={{ width: '100%' }}
                  />
                </div>
                <button className="btn-persona" type="submit" disabled={generatingConvite}>
                  {generatingConvite ? 'GERANDO...' : 'GERAR CÓDIGO DE CONVITE'}
                </button>
              </form>
              {conviteMessage && <div style={{ color: 'var(--p4-green)', marginTop: 8, fontSize: '0.88rem', fontWeight: 'bold' }}>{conviteMessage}</div>}
              {conviteError && <div style={{ color: 'var(--p4-gold)', marginTop: 8, fontSize: '0.88rem' }}>⚠ {conviteError}</div>}
            </div>

            {/* Convites Ativos */}
            <div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: 'var(--p4-gray)', marginBottom: 12 }}>
                // CÓDIGOS DE CONVITE ATIVOS
              </div>
              {loadingConvites ? (
                <div style={{ color: 'var(--p4-gray)' }}>Carregando convites...</div>
              ) : convites.length === 0 ? (
                <div style={{
                  background: 'var(--p4-card)',
                  border: '1px solid var(--p4-border)',
                  padding: 18,
                  color: 'var(--p4-gray)',
                  fontFamily: 'Rajdhani, sans-serif'
                }}>
                  Nenhum código de convite ativo encontrado. Gere um ao lado!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {convites.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--p4-card)',
                        border: '1px solid var(--p4-border)',
                        borderLeft: '4px solid var(--p4-gold)',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--p4-gold)', letterSpacing: '0.05em' }}>
                          {c.codigo}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--p4-gray)', fontFamily: 'Share Tech Mono, monospace' }}>
                          DESTINATÁRIO: {c.email.toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(c.codigo);
                          alert('Código copiado para a área de transferência!');
                        }}
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                      >
                        COPIAR
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
