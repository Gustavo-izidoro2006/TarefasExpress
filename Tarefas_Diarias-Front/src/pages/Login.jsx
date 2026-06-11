import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../store/store';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('demo@tarefaexpress.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Falha ao entrar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--persona-black)',
      display: 'flex',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '45%',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a0f 50%, #0a0a0f 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          width: '200%', height: '200%',
          top: '-50%', left: '-50%',
          background: 'linear-gradient(45deg, transparent 48%, rgba(230,57,70,0.08) 49%, rgba(230,57,70,0.08) 51%, transparent 52%)',
          transform: 'rotate(-15deg)',
        }} />
        <div style={{
          textAlign: 'center',
          animation: 'slideInLeft 0.6s ease forwards',
          zIndex: 1,
        }}>
          <div style={{
            width: 80, height: 80,
            background: 'linear-gradient(135deg, var(--persona-red), #ff6b35)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem',
            boxShadow: 'var(--shadow-red), 0 0 60px rgba(230,57,70,0.2)',
            margin: '0 auto 24px',
          }}>
            ✓
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '3.5rem', letterSpacing: '0.2em',
            color: 'var(--persona-white)', lineHeight: 0.9,
            textShadow: '0 0 40px rgba(230,57,70,0.4)',
          }}>
            TAREFA<br />
            <span style={{ color: 'var(--persona-red)' }}>EXPRESS</span>
          </div>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.75rem', color: 'var(--persona-gray)',
            letterSpacing: '0.2em', marginTop: 16,
          }}>
            GERENCIE · COLABORE · CONQUISTE
          </div>
          <div style={{
            marginTop: 32,
            padding: '14px 20px',
            background: 'rgba(230,57,70,0.1)',
            border: '1px solid rgba(230,57,70,0.2)',
            textAlign: 'left',
          }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', color: 'var(--persona-gray)', marginBottom: 6 }}>
              // CONTA DE DEMONSTRAÇÃO
            </div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.88rem', color: 'var(--persona-white)' }}>
              📧 demo@tarefaexpress.com<br />
              🔒 123456
            </div>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 60px',
        background: 'var(--persona-dark)',
        borderLeft: '2px solid var(--persona-border)',
      }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 40, animation: 'slideInRight 0.5s ease forwards' }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.75rem', color: 'var(--persona-red)',
              letterSpacing: '0.2em', marginBottom: 8,
            }}>
              // ACESSO AO SISTEMA
            </div>
            <div className="section-title" style={{ marginBottom: 4, fontSize: '2.2rem' }}>
              BEM-VINDO!
            </div>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--persona-gray)', fontSize: '0.95rem',
            }}>
              Entre com sua conta cadastrada
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.7rem', color: 'var(--persona-gray)',
                letterSpacing: '0.12em', display: 'block', marginBottom: 6,
              }}>
                ✉ E-MAIL
              </label>
              <input
                className="p-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '0.7rem', color: 'var(--persona-gray)',
                letterSpacing: '0.12em', display: 'block', marginBottom: 6,
              }}>
                🔒 SENHA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="p-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: 10, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    color: 'var(--persona-gray)', cursor: 'pointer',
                  }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error ? (
              <div style={{ color: 'var(--persona-red)', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                ⚠ {error}
              </div>
            ) : null}

            <button className="btn-persona" type="submit" disabled={loading} style={{ padding: '13px', marginTop: 8 }}>
              {loading ? 'VERIFICANDO...' : 'ENTRAR'}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/register')}
              style={{ padding: '13px' }}
            >
              CRIAR CONTA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
