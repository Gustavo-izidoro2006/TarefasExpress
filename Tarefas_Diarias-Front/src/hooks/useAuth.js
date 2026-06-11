// Re-exporta o contexto de auth como hook para compatibilidade.
// Toda a lógica de autenticação está em ../store/store.js (AuthProvider).
export { useAuthContext as useAuth } from '../store/store';
