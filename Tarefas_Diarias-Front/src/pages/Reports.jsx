import { useEffect, useState } from 'react';
import { reportsService } from '../services/reports';

const fallback = {
  taxaConclusao: '73%',
  tarefasSemana: '21',
  emAtraso: '3',
  gruposAtivos: '3',
  bars: [
    { day: 'SEG', val: 70, color: 'var(--p4-gold)' },
    { day: 'TER', val: 40, color: 'var(--p4-gold)' },
    { day: 'QUA', val: 90, color: 'var(--p4-gold)' },
    { day: 'QUI', val: 55, color: 'var(--p4-gold)' },
    { day: 'SEX', val: 80, color: 'var(--p4-green)' },
    { day: 'SAB', val: 20, color: 'var(--p4-gray)' },
    { day: 'DOM', val: 10, color: 'var(--p4-gray)' },
  ],
};

export const Reports = () => {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(fallback);

  useEffect(() => {
    setMounted(true);

    // Busca dados reais (quando endpoint do backend existir).
    // Se falhar, mantém fallback para não quebrar UI.
    reportsService
      .getDashboardStats()
      .then((data) => {
        if (!data) return;
        setStats({
          taxaConclusao: data?.taxaConclusao ?? fallback.taxaConclusao,
          tarefasSemana: data?.tarefasSemana ?? fallback.tarefasSemana,
          emAtraso: data?.emAtraso ?? fallback.emAtraso,
          gruposAtivos: data?.gruposAtivos ?? fallback.gruposAtivos,
          bars: Array.isArray(data?.bars) && data.bars.length ? data.bars : fallback.bars,
        });
      })
      .catch(() => {
        // sem console.error aqui para não poluir, mas pode trocar se desejar.
        setStats(fallback);
      });
  }, []);

  const cards = [
    { label: 'TAXA DE CONCLUSÃO', value: stats.taxaConclusao, color: 'var(--p4-green)' },
    { label: 'TAREFAS/SEMANA', value: stats.tarefasSemana, color: 'var(--p4-gold)' },
    { label: 'EM ATRASO', value: stats.emAtraso, color: 'var(--p4-red)' },
    { label: 'GRUPOS ATIVOS', value: stats.gruposAtivos, color: 'var(--p4-white)' },
  ];

  return (
    <div className="page-wrapper" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, opacity: 0, animation: mounted ? 'slideInLeft 0.4s ease both' : 'none' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--p4-gold)', letterSpacing: '0.18em', marginBottom: 6 }}>// ANÁLISE</div>
        <div className="section-title">RELATÓRIOS</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {cards.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: 'var(--p4-card)',
              border: `1px solid ${s.color}33`,
              borderLeft: `4px solid ${s.color}`,
              padding: '14px',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
              opacity: 0,
              animation: mounted ? `slideInUp 0.4s ${0.08 + i * 0.06}s ease both` : 'none',
            }}
          >
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--p4-gray)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'var(--p4-card)',
          border: '1px solid var(--p4-border)',
          borderTop: '3px solid var(--p4-gold)',
          padding: '18px',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          opacity: 0,
          animation: mounted ? 'slideInUp 0.4s 0.32s ease both' : 'none',
        }}
      >
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'var(--p4-white)', letterSpacing: '0.08em', marginBottom: 16 }}>TAREFAS POR DIA</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {stats.bars.map((b, i) => (
            <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: '100%',
                  height: `${b.val}%`,
                  background: b.color,
                  opacity: 0.8,
                  clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)',
                  animation: mounted ? `slideInUp 0.5s ${0.4 + i * 0.05}s ease both` : 'none',
                  transition: 'height 0.5s',
                }}
              />
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: 'var(--p4-gray)' }}>{b.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

