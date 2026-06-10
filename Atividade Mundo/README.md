---

# 🚀 Executando o Projeto

O sistema é composto por três partes:

1. PostgreSQL (Docker Compose)
2. Backend Node.js
3. Frontend React + Vite

---

## 🐘 1. Subindo o Banco de Dados

Na raiz do projeto execute:

```bash
docker compose up -d
```

Verifique se o container foi iniciado:

```bash
docker ps
```

O PostgreSQL deverá estar em execução.

Para parar o banco:

```bash
docker compose down
```

---

## ⚙️ 2. Executando o Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=geo_crud
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=sua_chave_secreta

OPENWEATHER_API_KEY=sua_api_key
```

Execute as migrations (caso existam):

```bash
npm run migration:run
```

Inicie a aplicação:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

Documentação Swagger:

```text
http://localhost:3000/api-docs
```

---

## 💻 3. Executando o Frontend

Abra outro terminal e acesse:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Execute o projeto:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```
