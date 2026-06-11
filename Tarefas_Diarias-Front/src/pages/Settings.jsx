import { useState, useEffect } from 'react';
export const Settings = () => {
  const [mounted, setMounted] = useState(false);
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const Toggle = ({ value, onChange }) => (
    <div onClick={onChange} style={{ width: 44, height: 24, background: value ? 'var(--persona-red)' : 'var(--persona-border)', borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 2, left: value ? 22 : 2, width: 20, height: 20, background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
    </div>
  );
  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--persona-red)', letterSpacing: '0.18em', marginBottom: 6 }}>// SISTEMA</div>
        <div className="section-title">CONFIGURAÇÕES</div>
      </div>
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'NOTIFICAÇÕES', desc: 'Receber alertas de tarefas e mensagens', value: notif, set: () => setNotif(!notif), delay: 0.1 },
          { label: 'SOM', desc: 'Sons ao receber notificações', value: sound, set: () => setSound(!sound), delay: 0.16 },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--persona-card)', border: '1px solid var(--persona-border)', borderLeft: '4px solid var(--persona-border)', padding: '16px 18px', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', opacity: 0, animation: mounted ? `slideInLeft 0.4s ${s.delay}s ease both` : 'none' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--persona-white)' }}>{s.label}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: 'var(--persona-gray)' }}>{s.desc}</div>
            </div>
            <Toggle value={s.value} onChange={s.set} />
          </div>
        ))}
      </div>
    </div>
  );
};
