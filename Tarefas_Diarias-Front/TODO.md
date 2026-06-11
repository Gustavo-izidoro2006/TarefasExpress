# TODO - Correção de warnings e erro de login

## Feito
- Entendi que o erro crítico no console é: `net::ERR_CONNECTION_REFUSED http://localhost:5155/api/auth/login`.
- Identifiquei que a URL do backend vem de `src/services/api.js` (fallback: `http://localhost:5155/api`).
- Li `src/index.jsx` e `src/routes/AppRoutes.jsx` e concluí que os warnings de React Router são apenas alertas futuros (não causam o erro de conexão).

## Próximos passos
1. Confirmar a porta correta do backend (ex.: 3000, 8080, 5155).
2. Atualizar a configuração no front:
   - definir `REACT_APP_API_URL` (ou `EXPO_PUBLIC_API_URL` se for Expo) apontando para `http://localhost:<porta>/api`.
3. Reiniciar o front (`npm start`) e validar se o login responde sem `ERR_CONNECTION_REFUSED`.
4. Se desejado, reduzir/ocultar warnings de React Router:
   - atualizar React Router para versão compatível ou aplicar future flags conforme documentação.

