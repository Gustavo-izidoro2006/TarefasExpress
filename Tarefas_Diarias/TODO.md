# TODO - Ajustes de Segurança (membros/convites) e Dashboard

- [ ] Criar controle de acesso básico no backend (autenticação por token/JWT ou sessão), substituindo acesso “sem auth”.
- [ ] Implementar endpoint para obter usuário logado via middleware (ex: header Authorization).
- [ ] Em `GruposController`:
  - [ ] Filtrar `Get()` para retornar somente grupos do usuário logado.
  - [ ] Em `GetById` e ações de grupo (`tarefas`, `membros`, `chat`, `convites`), validar que o usuário é membro do grupo.
  - [ ] Em `CreateTarefa`, validar membro e permitir criação apenas para membros.
  - [ ] Em `SendChatMessage`, validar membro e permitir apenas membros.
  - [ ] Em `CreateConvite/GetConvites`, validar administrador (ou ao menos membro) do grupo.
- [ ] Em `TarefasController` (CRUD de tarefas):
  - [ ] Restringir leitura/alteração/exclusão de tarefas para membros do grupo associado à tarefa.
- [ ] Em `UsuariosController`:
  - [ ] Remover/limitar `GET /usuarios` (ou trocar por `GET /usuarios/me`).
  - [ ] Garantir que listar usuários não vaze dados.
- [ ] Atualizar `RelatoriosController.Dashboard()` para calcular estatísticas **por grupos do usuário logado**.
- [ ] No Front (`Dashboard.jsx`):
  - [ ] Parar de chamar `GET /usuarios` e usar endpoint de stats.
- [ ] No Front (`Reports.jsx`):
  - [ ] Evitar fallback com placeholders que escondem falta de permissão.
- [ ] Testar fluxos:
  - [ ] Usuário A não deve ver grupos do usuário B.
  - [ ] Usuário não membro não deve criar tarefa nem acessar chat/membros/convites.
  - [ ] Dashboard/relatórios não devem mostrar “contagem de usuários” global.

