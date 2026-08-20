# Projeto Aberto RJ

Aplicação demonstrativa para gestão interna de projetos e publicação de informações de transparência pública.

## Stack

- Laravel 13 e PHP 8.4
- PostgreSQL 17
- React Router, React e TypeScript
- Zustand para estado no frontend
- Axios para acesso à API
- Tailwind CSS
- Docker Compose

## Executar com Docker

Pré-requisitos:

- Docker
- Docker Compose

Suba o ambiente na raiz do projeto:

```bash
docker compose up --build
```

Acesse:

- Frontend: http://localhost:3000
- API: http://localhost:8000/api
- Adminer: http://localhost:8080

O Compose configura as variáveis da aplicação, banco e JWT. O `.env` local não é copiado para as imagens nem necessário para executar o ambiente Docker.

Os valores de `APP_KEY` e `JWT_SECRET` definidos no Compose são somente para demonstração local; substitua o `JWT_SECRET` por um segredo forte em qualquer ambiente compartilhado.

Para parar os containers:

```bash
docker compose down
```

Para apagar também os dados persistidos do PostgreSQL (operação destrutiva):

```bash
docker compose down -v
```

## Dados iniciais

Os dados fictícios estão em:

```text
backend/database/seeders/data/dados-base.json
```

O container executa migrations e seeders ao iniciar. O seeder é idempotente e pode ser executado novamente sem duplicar os registros.

Usuário de demonstração:

```text
E-mail: ana.martins@projetoaberto.local
Senha:  ProjetoRJ@2026
```

## Rotas da aplicação

### Frontend

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público/autenticado | Redireciona para a área correspondente ao estado da sessão |
| `/login` | Público | Formulário de autenticação |
| `/transparencia` | Público | Indicadores, filtros e listagem de projetos publicados |
| `/transparencia/projetos/:codigo` | Público | Detalhes de um projeto publicado |
| `/gestao` | Autenticado | Placeholder da área de gestão |

### API

#### Autenticação

```http
POST /api/login
GET  /api/me              # Bearer token obrigatório
```

Exemplo de login:

```json
{
  "email": "ana.martins@projetoaberto.local",
  "password": "ProjetoRJ@2026"
}
```

#### Transparência pública

```http
GET /api/transparencia/projetos
GET /api/transparencia/projetos/{codigo}
GET /api/transparencia/orgaos
```

Filtros disponíveis em `/api/transparencia/projetos`:

```text
page=1
per_page=10
situacao=planejado|em_andamento|suspenso|concluido
orgao=1
```

Somente projetos com `publicado = true` são retornados. Os serializers públicos usam uma lista explícita de campos e não expõem `id`, `nota_interna`, dados de usuários ou credenciais.

#### Gestão autenticada

```http
GET /api/gestao/projetos
```

Essa rota exige `Authorization: Bearer <token>` e aceita `page`, `per_page`, `orgao_id` e `status`.

## Arquitetura resumida

### Backend

- `routes/api.php`: definição das rotas REST.
- `AuthController` e `JwtService`: autenticação JWT.
- `JwtAuthMiddleware`: proteção das rotas internas.
- `TransparenciaService`: consultas públicas e transformação dos dados expostos.
- `DatabaseSeeder`: carga da massa JSON fictícia.

### Frontend

- `app/services/http.ts`: cliente Axios, inclusão do Bearer token e tratamento de `401`.
- `app/services/api.ts`: chamadas aos endpoints.
- `app/stores/auth`: estado persistido somente do JWT.
- `app/stores/data`: dados retornados pela API, loading e erros.
- `app/routes`: páginas públicas, login e placeholders da área interna.

## Testes e validações

Backend:

```bash
docker compose exec backend php artisan test
```

Frontend, usando Node instalado localmente:

```bash
cd frontend
npm ci
npm run typecheck
npm run build
```

Os testes Laravel atuais são a estrutura inicial do projeto. A cobertura específica da regra de não exposição de campos públicos ainda deve ser adicionada.

## Limitações e próximos passos

- A área de gestão ainda não possui telas de criação e edição de projetos.
- A API de gestão atualmente oferece apenas a consulta filtrada.
- Não existe refresh token; quando o JWT expira, é necessário fazer login novamente.
- O filtro de busca textual ainda não foi definido/implementado.
- A rota pública usa `codigo` em vez do `id` interno; códigos sequenciais ainda podem ser previsíveis. Um UUID público seria uma evolução possível.
- Os indicadores exibidos na transparência representam todos os projetos publicados, mesmo quando a listagem está filtrada.
- Devem ser adicionados testes de publicação, filtros, detalhe público e ausência de campos restritos.

## Uso de IA

Ferramentas de IA foram utilizadas como apoio durante o desenvolvimento para:

- diagnosticar problemas de Docker, Composer e integração entre containers;
- estruturar serviços Axios, stores Zustand e componentes React;
- revisar configurações de Tailwind, Docker Compose e CORS;
- sugerir organização de rotas, estados de erro e documentação.

O código gerado foi revisado no contexto do projeto, ajustado às rotas e modelos existentes e validado com `npm run typecheck`, `npm run build` e verificações de sintaxe PHP quando aplicável.
