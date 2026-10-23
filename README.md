# API de Gestão de Pessoas (CRUD) - CI/CD Pipeline

Projeto prático desenvolvido para a disciplina de **Integração e Entrega Contínua (CI/CD)**.
Consiste em uma API RESTful completa em TypeScript para gerenciamento de usuários com cálculo dinâmico de idade, desenvolvida seguindo práticas rigorosas de **TDD**, **Análise Estática**, **Formatação Automatizada**, **Testes Automatizados (Unitários e de Integração)**, **Documentação OpenAPI/Swagger**, **GitFlow** e **Containerização com Docker**.

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (ES2022 / NodeNext)
- **Runtime & Servidor HTTP:** [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Documentação Interativa:** [Swagger UI](https://swagger.io/) (`swagger-ui-express` + OpenAPI 3.0)
- **Linter & Formatter:** [Biome](https://biomejs.dev/) (Análise estática de código e padronização estética)
- **Testes Automatizados:** [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)
- **Git Hooks & Padronização de Commits:** [Lefthook](https://github.com/evilmartians/lefthook) & [Commitlint](https://commitlint.js.org/) (Conventional Commits)
- **Containerização:** [Docker](https://www.docker.com/) (Node Alpine)

---

## 📋 Requisitos e Regras de Negócio

- **Dados da Entidade:**
  - `cpf` (string - Identificador único)
  - `name` (string)
  - `birthDate` (string - Formato `YYYY-MM-DD`)
  - `age` (number - Calculada automaticamente a partir da data de nascimento)
- **Regra de Cálculo de Idade (TDD):**
  - Considera o ano, mês e dia da data de nascimento em relação à data atual.
  - Bloqueia datas futuras com retorno `400 Bad Request`.
  - Recalcula automaticamente a idade em atualizações cadastrais.
- **Armazenamento:** Repositório em memória (`Map<string, User>`) para execução ágil e determinística dos testes.

---

## 🏛️ Arquitetura do Projeto

O projeto adota separação clara de responsabilidades em camadas desacopladas:

```text
Workflow_CRUD/
├── src/
│   ├── controllers/      # Handlers HTTP e controle de fluxo (req, res)
│   │   └── user.controller.ts
│   ├── docs/             # Especificação OpenAPI / Swagger
│   │   └── swagger.json
│   ├── domain/           # Regras de negócio puras e contratos
│   │   ├── calculate-age.ts
│   │   └── contracts/    # Interfaces e tipos (User, CreateUserInput, etc.)
│   ├── repositories/     # Persistência em memória (CRUD)
│   │   └── user.repository.ts
│   ├── routes/           # Mapeamento de rotas Express
│   │   └── user.routes.ts
│   ├── app.ts            # Configuração do Express, middlewares e Swagger
│   └── server.ts         # Ponto de entrada (inicialização do listen na porta 3000)
│
├── test/
│   ├── unit/             # Testes unitários focados na regra de negócio (TDD)
│   │   └── calculate-age.spec.ts
│   └── integration/      # Testes de integração das rotas HTTP com Supertest
│       └── user.routes.spec.ts
│
├── .dockerignore
├── dockerfile
├── biome.json            # Configuração de linting e formatação
├── commitlint.config.cjs # Validação de mensagens de commit
├── lefthook.yml          # Automação de pre-commit e commit-msg hooks
├── tsconfig.json         # Configuração estrita do compilador TypeScript
└── package.json
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20+)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para execução em container)

### 1. Clonar o Repositório
```bash
git clone https://github.com/nickdsm24/Workflow_CRUD.git
cd Workflow_CRUD
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Ativar os Git Hooks (Lefthook)
```bash
npx lefthook install
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
A API estará acessível em: `http://localhost:3000`

---

## 📖 Documentação da API (Swagger)

Com o servidor rodando, acesse a interface visual e interativa da documentação:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Endpoints Disponíveis:

| Método | Rota | Descrição | Status de Sucesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Cadastra um novo usuário (calcula idade automaticamente) | `201 Created` |
| `GET` | `/users` | Lista todos os usuários cadastrados | `200 OK` |
| `GET` | `/users/:cpf` | Busca um usuário específico pelo CPF | `200 OK` |
| `PUT` | `/users/:cpf` | Atualiza os dados cadastrais (recalcula idade se houver nova data) | `200 OK` |
| `PATCH` | `/users/:cpf` | Atualização parcial dos dados | `200 OK` |
| `DELETE` | `/users/:cpf` | Remove um usuário pelo CPF | `204 No Content` |

---

## 🧪 Testes Automatizados & Qualidade de Código

### Análise Estática (Typecheck e Linter)
```bash
# Checagem estrita de tipos com TypeScript
npm run type-check

# Análise de regras de qualidade e bugs potenciais com Biome
npm run lint
```

### Verificação de Formatação
```bash
npm run format:check
```

### Execução de Testes (Unitários e Integração)
```bash
# Executa toda a suíte de testes (17 testes)
npm test

# Executa em modo watch durante o desenvolvimento
npm run test:watch
```

---

## 🐳 Executando com Docker

### 1. Criar a Imagem Docker
```bash
docker build -t workflow-crud-app .
```

### 2. Executar o Container
```bash
docker run -p 3000:3000 --name crud-api workflow-crud-app
```
Acesse `http://localhost:3000/api-docs` para validar a aplicação rodando no container.

---

## 🌿 Padrão de Versionamento (GitFlow & Conventional Commits)

O repositório adota o modelo **GitFlow** com validação rigorosa de mensagens de commit via **Commitlint**:

- `main`: Branch de versão estável de entrega.
- `develop`: Branch de integração contínua.
- `feat/*`: Novas funcionalidades.
- `test/*`: Implementações de testes (TDD e unitário).
- `chore/*`: Configurações de ambiente, tooling e dependências.
- `refac/*`: Refatorações arquiteturais sem alteração de comportamento.

---

## 📄 Licença

Este projeto está sob a licença [ISC](LICENSE).
