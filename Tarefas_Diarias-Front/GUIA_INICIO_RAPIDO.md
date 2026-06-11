# 🚀 Guia de Início Rápido - TarefaExpress Frontend

## Instalação

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` conforme necessário.

### 3. Inicie o servidor de desenvolvimento
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

### Componentes
Componentes reutilizáveis organizados por feature:
- `src/components/Auth/` - Componentes de autenticação
- `src/components/Tasks/` - Componentes de tarefas
- `src/components/Groups/` - Componentes de grupos
- `src/components/Chat/` - Componentes de chat
- `src/components/Common/` - Componentes comuns
- `src/components/Sidebar/` - Componentes de navegação
- `src/components/Profile/` - Componentes de perfil

### Páginas
Páginas da aplicação em `src/pages/`:
- Dashboard
- Login / Register
- Groups / GroupDetail
- TaskDetail
- Categories
- Notifications
- Reports
- Settings
- Profile

### Rotas
Configuradas em `src/routes/AppRoutes.jsx`:
- `/` - Dashboard
- `/login` - Login
- `/register` - Registro
- `/grupos` - Lista de grupos
- `/grupos/:id` - Detalhes do grupo
- `/tarefas/:id` - Detalhes da tarefa
- `/categorias` - Categorias
- `/notificacoes` - Notificações
- `/relatorios` - Relatórios
- `/configuracoes` - Configurações
- `/perfil` - Perfil

## Como Implementar Funcionalidades

### 1. Criar um novo componente
```javascript
// src/components/SeuComponente/SeuComponente.jsx
export const SeuComponente = ({ prop1, prop2 }) => {
  return (
    <div>
      <h3>Seu Componente</h3>
      {/* Implementação */}
    </div>
  );
};
```

### 2. Exportar o componente
Adicione em `src/components/SeuComponente/index.js`:
```javascript
export { SeuComponente } from './SeuComponente';
```

### 3. Implementar serviços de API
Adicione aqui em `src/services/api.js`:
```javascript
export const apiClient = {
  get: async (path) => {
    // TODO: Implementar GET
  },
  post: async (path, data) => {
    // TODO: Implementar POST
  },
  // ... outros métodos
};
```

### 4. Crear hooks customizados
Crie em `src/hooks/useSeuHook.js`:
```javascript
export const useSeuHook = () => {
  // TODO: Implementar hook
};
```

### 5. Adicionar estado global
Configure em `src/store/store.js` (Redis/Context API)

## Scripts Disponíveis

```bash
npm start      # Inicia o servidor de desenvolvimento
npm build      # Build para produção
npm test       # Executa testes
npm eject      # Eject (cuidado: irreversível)
```

## Estrutura de um Componente Completo

```javascript
import { useState } from 'react';

export const ComponenteCompleto = ({ onAction }) => {
  const [state, setState] = useState(null);

  const handleClick = () => {
    // TODO: Implementar lógica
  };

  return (
    <div className="componente-completo">
      <h2>Título</h2>
      {/* Conteúdo */}
      <button onClick={handleClick}>Ação</button>
    </div>
  );
};
```

## Estrutura de uma Página Completa

```javascript
import { MainLayout } from '../layouts/MainLayout';

export const MinhaPage = () => {
  return (
    <MainLayout>
      <h1>Minha Página</h1>
      {/* Conteúdo */}
    </MainLayout>
  );
};
```

## Padrão de Navegação

Use o Link do React Router:
```javascript
import { Link } from 'react-router-dom';

export const SeuComponente = () => {
  return (
    <Link to="/grupos">Ir para Grupos</Link>
  );
};
```

## Próximas Prioridades

1. ✅ Estrutura básica criada
2. ⏳ Implementar autenticação (login/logout)
3. ⏳ Integrar com API backend
4. ⏳ Implementar gerenciamento de estado
5. ⏳ Adicionar estilos e temas
6. ⏳ Implementar funcionalidades de tarefas, grupos e chat
7. ⏳ Testes unitários e de integração
8. ⏳ Deploy

## Recursos Úteis

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [React Hooks](https://react.dev/reference/react)

## Suporte

Para adicionar novas funcionalidades:
1. Crie a estrutura de pastas necessária
2. Implemente os componentes
3. Adicione as rotas
4. Configure os serviços de API

Todos os arquivos já incluem `TODO:` comentários indicando onde implementar a lógica.

---

**Desenvolvido para TarefaExpress** 🎯
