import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../store/store';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register({
        nomeCompleto: nome.trim(),
        email: email.trim(),
        senha: password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Falha ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--p4-black)',
      display: 'flex',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '45%',
        background: 'linear-gradient(135deg, #0d0c08 0%, #1a1a0a 50%, #0d0c08 100%)',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '200%', height: '200%',
          top: '-50%', left: '-50%',
          background: 'linear-gradient(45deg, transparent 48%, rgba(245,197,24,0.07) 49%, rgba(245,197,24,0.07) 51%, transparent 52%)',
          transform: 'rotate(-15deg)',
        }} />
        <div style={{ textAlign: 'center', animation: 'slideInLeft 0.6s ease forwards', zIndex: 1 }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2.8rem', letterSpacing: '0.15em',
            color: 'var(--p4-white)', lineHeight: 0.9,
          }}>
            CRIAR<br /><span style={{ color: 'var(--p4-blue)' }}>CONTA</span>
          </div>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.7rem', color: 'var(--p4-gray)',
            letterSpacing: '0.15em', marginTop: 16,
          }}>
            JUNTE-SE À EQUIPE
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 60px', background: 'var(--p4-dark)',
        borderLeft: '2px solid var(--p4-border)',
      }}>
        <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36, animation: 'slideInRight 0.5s ease forwards' }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.75rem', color: 'var(--p4-blue)',
              letterSpacing: '0.2em', marginBottom: 8,
            }}>
              // NOVO USUÁRIO
            </div>
            <div className="section-title" style={{ fontSize: '2.2rem' }}>
              CADASTRO
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
                👤 NOME COMPLETO
              </label>
              <input
                className="p-input"
                placeholder=""
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
                ✉ E-MAIL
              </label>
              <input
                className="p-input"
                placeholder=""
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', letterSpacing: '0.12em', display: 'block', marginBottom: 6 }}>
                🔒 SENHA
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="p-input"
                  placeholder=""
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    color: 'var(--p4-gray)', cursor: 'pointer',
                  }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error ? (
              <div style={{ color: 'var(--p4-gold)', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                ⚠ {error}
              </div>
            ) : null}

            <button className="btn-persona" type="submit" disabled={loading} style={{ padding: '13px', marginTop: 8 }}>
              {loading ? 'CADASTRANDO...' : 'CRIAR CONTA'}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/login')}
              style={{ padding: '13px' }}
            >
              JÁ TENHO CONTA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
