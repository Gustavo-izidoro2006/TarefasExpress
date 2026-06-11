import { useNavigate } from 'react-router-dom';
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--persona-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '8rem', color: 'var(--persona-red)', lineHeight: 1, textShadow: '0 0 40px rgba(230,57,70,0.4)', animation: 'glitch 3s infinite' }}>404</div>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--persona-gray)', letterSpacing: '0.2em' }}>PÁGINA NÃO ENCONTRADA</div>
      <button className="btn-persona" onClick={() => navigate('/dashboard')}>VOLTAR AO INÍCIO</button>
    </div>
  );
};
