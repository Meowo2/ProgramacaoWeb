# 🌍 GEO CRUD — Backend TypeScript + PostgreSQL + Sequelize

Backend completo para gerenciamento de **cidades, países e continentes**, com autenticação JWT e integração com duas APIs externas.

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| **TypeScript** | Linguagem principal |
| **Node.js + Express** | Servidor HTTP |
| **PostgreSQL** | Banco de dados relacional |
| **Sequelize** | ORM (substituindo Prisma) |
| **JWT + bcryptjs** | Autenticação segura |
| **REST Countries API** | Dados externos de países (gratuita, sem chave) |
| **OpenWeatherMap API** | Clima por coordenadas (chave gratuita) |

---

## ⚙️ Configuração

### 1. Clone e instale as dependências
```bash
cd backend
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mundo_crud
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=uma_string_secreta_longa
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

OPENWEATHER_API_KEY=sua_chave_aqui   # https://openweathermap.org/api
```

### 3. Crie o banco de dados no PostgreSQL
```sql
CREATE DATABASE mundo_crud;
```

### 4. Sincronize os modelos (cria as tabelas)
```bash
npm run db:sync
```

### 5. Inicie o servidor em modo desenvolvimento
```bash
npm run dev
```

---

## 🗄 Estrutura do Banco de Dados

```
continentes
 └── paises (id_continente → continentes.id)
      └── cidades (id_pais → paises.id)

usuarios (tabela independente para autenticação)
```

---

## 📌 Endpoints da API

### 🔐 Autenticação
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastra novo usuário | ❌ |
| POST | `/auth/login` | Login, retorna token JWT | ❌ |
| GET | `/auth/me` | Dados do usuário logado | ✅ |

**Exemplo de login:**
```json
POST /auth/login
{
  "email": "usuario@email.com",
  "senha": "minhasenha"
}
```
Resposta: `{ "token": "eyJ...", "user": { ... } }`

Envie o token em todas as requisições privadas:
```
Authorization: Bearer eyJ...
```

---

### 🌎 Continentes
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/continentes` | Lista todos (paginado) |
| GET | `/continentes/:id` | Busca por ID (inclui países) |
| POST | `/continentes` | Cria continente |
| PUT | `/continentes/:id` | Atualiza continente |
| DELETE | `/continentes/:id` | Remove (se sem países) |

**Query params GET /continentes:** `?page=1&limit=10&search=Europa`

**Body POST/PUT:**
```json
{
  "nome": "América do Sul",
  "descricao": "Continente localizado no hemisfério sul das Américas."
}
```

---

### 🏳 Países
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/paises` | Lista todos (paginado) |
| GET | `/paises/:id` | Busca por ID (inclui continente e cidades) |
| POST | `/paises` | Cria país |
| PUT | `/paises/:id` | Atualiza país |
| DELETE | `/paises/:id` | Remove (se sem cidades) |

**Query params GET /paises:** `?page=1&limit=10&search=Brasil&id_continente=1`

**Body POST:**
```json
{
  "nome": "Brasil",
  "populacao": 215313498,
  "idioma_oficial": "Português",
  "moeda": "Real (BRL)",
  "id_continente": 1
}
```

---

### 🏙 Cidades
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cidades` | Lista todas (paginado) |
| GET | `/cidades/:id` | Busca por ID (inclui país e continente) |
| POST | `/cidades` | Cria cidade |
| PUT | `/cidades/:id` | Atualiza cidade |
| DELETE | `/cidades/:id` | Remove cidade |

**Query params GET /cidades:** `?page=1&limit=10&search=São Paulo&id_pais=1&id_continente=2`

**Body POST:**
```json
{
  "nome": "São Paulo",
  "populacao": 12396372,
  "latitude": -23.5505,
  "longitude": -46.6333,
  "id_pais": 1
}
```

---

### 🌐 APIs Externas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api-externas/pais/:nome` | Info do país via REST Countries |
| GET | `/api-externas/regiao/:regiao` | Países de uma região |
| GET | `/api-externas/clima/cidade/:id` | Clima de cidade cadastrada |
| GET | `/api-externas/clima?lat=X&lon=Y` | Clima por coordenadas |
| GET | `/api-externas/pais-enriquecido/:id` | País + REST Countries + clima juntos |

**Exemplos:**
```
GET /api-externas/pais/Brazil
GET /api-externas/regiao/Americas
GET /api-externas/clima/cidade/1
GET /api-externas/clima?lat=-23.55&lon=-46.63
GET /api-externas/pais-enriquecido/1
```

---

### ❤️ Health Check
```
GET /health
```

---

## 📦 Scripts disponíveis

```bash
npm run dev       # Servidor com hot-reload (ts-node-dev)
npm run build     # Compila TypeScript → dist/
npm run start     # Executa build compilado
npm run db:sync   # Sincroniza/cria tabelas no banco
```

---

## 📁 Estrutura de Pastas

```
src/
├── config/
│   ├── database.ts        # Conexão Sequelize
│   └── syncDb.ts          # Script para criar tabelas
├── models/
│   ├── index.ts           # Exporta todos os modelos
│   ├── Continent.ts       # Modelo continentes
│   ├── Country.ts         # Modelo países + associações
│   ├── City.ts            # Modelo cidades + associações
│   └── User.ts            # Modelo usuários (auth)
├── controllers/
│   ├── authController.ts
│   ├── continentController.ts
│   ├── countryController.ts
│   ├── cityController.ts
│   └── externalApiController.ts
├── routes/
│   ├── authRoutes.ts
│   ├── continentRoutes.ts
│   ├── countryRoutes.ts
│   ├── cityRoutes.ts
│   └── externalApiRoutes.ts
├── middlewares/
│   ├── auth.ts            # Verificação JWT
│   └── errorHandler.ts    # Handler global de erros
├── services/
│   └── externalApiService.ts  # REST Countries + OpenWeatherMap
├── app.ts                 # Configuração Express
└── server.ts              # Entry point
```
