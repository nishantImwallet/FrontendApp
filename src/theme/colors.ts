/**
 * FlyGo Design System - Colors
 * Centralized color palette for the entire application.
 */

export const COLORS = {
  // Brand Colors
  primary: '#0059bb',
  primaryDark: '#00428d',
  primaryLight: '#eff4ff',

  // Neutral & Text Colors
  textDark: '#121c2a',
  textMuted: '#565e74',
  textPlaceholder: '#94a3b8',
  textLight: '#ffffff',

  // Backgrounds
  background: '#f8f9ff',
  cardBg: '#ffffff',
  surfaceLight: '#f1f5f9',

  // Borders & Dividers
  borderDark: '#121c2a',
  borderLight: '#c1c6d7',
  borderDivider: 'rgba(193, 198, 215, 0.4)',

  // Status & Feedback Colors
  error: '#ba1a1a',
  errorBg: '#ffdad6',
  success: '#10b981',
  successBg: '#ecfdf5',
  warning: '#f59e0b',
  warningBg: '#fffbeb',

  // Accents
  goldTier: '#b45309',
};

export type ColorType = typeof COLORS;
