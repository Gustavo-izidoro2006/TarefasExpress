import { apiClient } from './api';

const STORAGE_KEY = 'tarefaexpress.currentUser';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStoredUser() {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  if (!canUseStorage()) return;
  try {
    // Never store the password
    const { senha, hashSenha, ...safeUser } = user;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  } catch {
    // noop
  }
}

function clearStoredUser() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export const authService = {
  /**
   * Faz login usando o endpoint POST /auth/login do backend.
   * O backend verifica email + senha e retorna os dados do usuário.
   */
  async login({ email, senha }) {
    const user = await apiClient.post('/auth/login', { email, senha });
    storeUser(user);
    return user;
  },

  /**
   * Cria uma nova conta de usuário.
   */
  async register(payload) {
    const created = await apiClient.post('/usuarios', {
      nomeCompleto: payload.nomeCompleto,
      email: payload.email,
      senha: payload.senha,
    });
    storeUser(created);
    return created;
  },

  /**
   * Atualiza o perfil do usuário logado.
   */
  async updateProfile(id, payload) {
    const updated = await apiClient.put(`/usuarios/${id}`, payload);
    const current = readStoredUser();
    if (current && String(current.id) === String(id)) {
      storeUser({ ...current, ...updated });
    }
    return updated;
  },

  logout() {
    clearStoredUser();
  },

  getCurrentUser() {
    return readStoredUser();
  },

  isAuthenticated() {
    return readStoredUser() !== null;
  },
};
