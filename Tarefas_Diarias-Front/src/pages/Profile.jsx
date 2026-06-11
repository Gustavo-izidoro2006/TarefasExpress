import { useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { apiClient } from '../services/api';

export const Profile = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelefone, setNumeroTelefone] = useState('');
  const [biografia, setBiografia] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);

    const load = async () => {
      try {
        const current = authService.getCurrentUser();
        if (current) {
          setUser(current);
          setNomeCompleto(current.nomeCompleto || '');
          setEmail(current.email || '');
          setNumeroTelefone(current.numeroTelefone || '');
          setBiografia(current.biografia || '');
        } else {
          const users = await apiClient.get('/usuarios');
          const first = Array.isArray(users) ? users[0] : null;
          if (first) {
            setUser(first);
            setNomeCompleto(first.nomeCompleto || '');
            setEmail(first.email || '');
            setNumeroTelefone(first.numeroTelefone || '');
            setBiografia(first.biografia || '');
          }
        }
      } catch (err) {
        setError(err?.message || 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');
      await authService.updateProfile(user.id, {
        nomeCompleto,
        email,
        numeroTelefone,
        biografia,
      });
      setMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gold)', letterSpacing: '0.18em', marginBottom: 6 }}>
          // SEU PERFIL REAL
        </div>
        <div className="section-title">PERFIL</div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--p4-gray)' }}>Carregando...</div>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: 520, opacity: 0, animation: mounted ? 'slideInUp 0.4s 0.1s ease both' : 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
            background: 'var(--p4-card)', border: '1px solid var(--p4-border)',
            borderLeft: '4px solid var(--p4-gold)', padding: '20px',
            clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)'
          }}>
            <div style={{ width: 64, height: 64, background: 'var(--p4-border)', borderRadius: '50%', border: '3px solid var(--p4-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              👤
            </div>
            <div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', letterSpacing: '0.1em', color: 'var(--p4-white)' }}>
                {nomeCompleto || 'USUÁRIO'}
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', color: 'var(--p4-gold)' }}>
                {user?.status === 1 ? 'ATIVO' : user?.status || 'ATIVO'}
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gray)', marginTop: 2 }}>
                {email}
              </div>
            </div>
          </div>

          {[
            { label: 'NOME', value: nomeCompleto, set: setNomeCompleto, type: 'text' },
            { label: 'E-MAIL', value: email, set: setEmail, type: 'email' },
            { label: 'TELEFONE', value: numeroTelefone, set: setNumeroTelefone, type: 'text' },
          ].map((f, i) => (
            <div key={f.label} style={{ marginBottom: 14, opacity: 0, animation: mounted ? `slideInLeft 0.4s ${0.2 + i * 0.07}s ease both` : 'none' }}>
              <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 5 }}>
                {f.label}
              </label>
              <input
                className="p-input"
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                placeholder=""
              />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', display: 'block', marginBottom: 5 }}>
              BIOGRAFIA
            </label>
            <textarea
              className="p-input"
              rows={4}
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder=""
              style={{ resize: 'vertical' }}
            />
          </div>

          {message ? (
            <div style={{ color: 'var(--p4-green)', marginBottom: 12 }}>{message}</div>
          ) : null}
          {error ? (
            <div style={{ color: 'var(--p4-gold)', marginBottom: 12 }}>{error}</div>
          ) : null}

          <button className="btn-persona" type="submit" disabled={saving} style={{ width: '100%', padding: '13px', marginTop: 8 }}>
            {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </button>
        </form>
      )}
    </div>
  );
};
