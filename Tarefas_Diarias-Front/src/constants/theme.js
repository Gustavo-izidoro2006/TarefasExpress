// ─── TAREFA EXPRESS — DESIGN TOKENS ─────────────────────────────────────────
// Persona 3/4 inspired: dark purple-black base, red accent, crisp white type

export const C = {
  // backgrounds
  bg:       '#0d0d1a',
  surface:  '#161625',
  card:     '#1e1e35',
  cardAlt:  '#252540',
  border:   '#2a2a4a',
  borderBright: '#3a3a60',

  // accents
  red:      '#ff2d55',
  redDark:  '#c41e3a',
  redGlow:  '#ff2d5533',
  green:    '#1db954',
  greenGlow:'#1db95433',
  yellow:   '#ffc300',
  blue:     '#4dabf7',
  purple:   '#845ef7',

  // text
  white:    '#ffffff',
  grey1:    '#c0c0dd',
  grey2:    '#7070a0',
  grey3:    '#2e2e50',
};

export const FONT = {
  black:   '900',
  bold:    '700',
  semibold:'600',
  regular: '400',
};

export const RADIUS = {
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  full: 999,
};

export const SHADOW = {
  red: {
    shadowColor: '#ff2d55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
};
