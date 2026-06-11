import { useState, useEffect } from 'react';

export const Notifications = () => {
  const [mounted, setMounted] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, msg: 'Bem-vindo! As categorias já estão conectadas ao backend.', time: 'agora', read: false, color: 'var(--p4-green)' },
    { id: 2, msg: 'Usuários podem ser cadastrados na tela de login/cadastro.', time: 'agora', read: false, color: 'var(--p4-blue)' },
  ]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gold)', letterSpacing: '0.18em', marginBottom: 6 }}>
          // AVISOS DA APLICAÇÃO
        </div>
        <div className="section-title">NOTIFICAÇÕES</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map((n, i) => (
          <div key={n.id} style={{
            background: n.read ? 'var(--p4-card)' : 'rgba(245,197,24,0.05)',
            border: `1px solid ${n.read ? 'var(--p4-border)' : n.color + '44'}`,
            borderLeft: `4px solid ${n.color}`,
            padding: '14px 18px',
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
            opacity: 0,
            animation: mounted ? `slideInLeft 0.4s ${0.15 + i * 0.06}s ease both` : 'none',
            cursor: 'pointer',
          }}
          onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', color: n.read ? 'var(--p4-gray)' : 'var(--p4-text)' }}>
                {n.msg}
              </div>
              {!n.read && <div style={{ width: 8, height: 8, background: n.color, borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem', color: 'var(--p4-gray)', marginTop: 6 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
