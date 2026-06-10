import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GEO CRUD API',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de **continentes, países e cidades** com integração a APIs externas (REST Countries e OpenWeatherMap).\n\n' +
        '## Autenticação\n' +
        'A maioria dos endpoints exige um token JWT. Faça login em `POST /auth/login`, copie o `token` retornado e clique em **Authorize** (cadeado) inserindo `Bearer <token>`.',
      contact: {
        name: 'Programação Web — Fatec SJC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Informe o token JWT obtido no login. Exemplo: `Bearer eyJ...`',
        },
      },
      schemas: {
        // ── Pagination ──────────────────────────────────────────────────────
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 5 },
          },
        },

        // ── Auth ─────────────────────────────────────────────────────────────
        RegisterBody: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            senha: { type: 'string', minLength: 6, example: 'senha123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login realizado com sucesso.' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nome: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@email.com' },
              },
            },
          },
        },

        // ── Continent ────────────────────────────────────────────────────────
        ContinentBody: {
          type: 'object',
          required: ['nome', 'descricao'],
          properties: {
            nome: { type: 'string', example: 'América do Sul' },
            descricao: {
              type: 'string',
              example: 'Continente localizado no hemisfério sul das Américas.',
            },
          },
        },
        Continent: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'América do Sul' },
            descricao: { type: 'string', example: 'Continente no hemisfério sul.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ContinentWithCountries: {
          allOf: [
            { $ref: '#/components/schemas/Continent' },
            {
              type: 'object',
              properties: {
                paises: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      nome: { type: 'string' },
                      populacao: { type: 'integer' },
                    },
                  },
                },
              },
            },
          ],
        },

        // ── Country ──────────────────────────────────────────────────────────
        CountryBody: {
          type: 'object',
          required: ['nome', 'populacao', 'idioma_oficial', 'moeda', 'id_continente'],
          properties: {
            nome: { type: 'string', example: 'Brasil' },
            populacao: { type: 'integer', example: 215313498 },
            idioma_oficial: { type: 'string', example: 'Português' },
            moeda: { type: 'string', example: 'Real (BRL)' },
            id_continente: { type: 'integer', example: 1 },
          },
        },
        Country: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Brasil' },
            populacao: { type: 'integer', example: 215313498 },
            idioma_oficial: { type: 'string', example: 'Português' },
            moeda: { type: 'string', example: 'Real (BRL)' },
            id_continente: { type: 'integer', example: 1 },
            continente: { $ref: '#/components/schemas/Continent' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── City ─────────────────────────────────────────────────────────────
        CityBody: {
          type: 'object',
          required: ['nome', 'populacao', 'latitude', 'longitude', 'id_pais'],
          properties: {
            nome: { type: 'string', example: 'São Paulo' },
            populacao: { type: 'integer', example: 12396372 },
            latitude: { type: 'number', format: 'float', example: -23.5505 },
            longitude: { type: 'number', format: 'float', example: -46.6333 },
            id_pais: { type: 'integer', example: 1 },
          },
        },
        City: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'São Paulo' },
            populacao: { type: 'integer', example: 12396372 },
            latitude: { type: 'number', example: -23.5505 },
            longitude: { type: 'number', example: -46.6333 },
            id_pais: { type: 'integer', example: 1 },
            pais: { $ref: '#/components/schemas/Country' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── External APIs ────────────────────────────────────────────────────
        WeatherData: {
          type: 'object',
          properties: {
            city: { type: 'string', example: 'São Paulo' },
            country: { type: 'string', example: 'BR' },
            temperature: { type: 'number', example: 22 },
            feelsLike: { type: 'number', example: 21 },
            humidity: { type: 'number', example: 75 },
            description: { type: 'string', example: 'céu limpo' },
            icon: { type: 'string', example: '01d' },
            iconUrl: {
              type: 'string',
              example: 'https://openweathermap.org/img/wn/01d@2x.png',
            },
            windSpeed: { type: 'number', example: 3.5 },
            pressure: { type: 'number', example: 1013 },
            visibility: { type: 'number', example: 10 },
            sunrise: { type: 'integer', example: 1718000000 },
            sunset: { type: 'integer', example: 1718040000 },
            timezone: { type: 'integer', example: -10800 },
            coords: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: -23.5505 },
                lon: { type: 'number', example: -46.6333 },
              },
            },
          },
        },
        CountryExternal: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                common: { type: 'string', example: 'Brazil' },
                official: { type: 'string', example: 'Federative Republic of Brazil' },
              },
            },
            capital: { type: 'array', items: { type: 'string' }, example: ['Brasília'] },
            region: { type: 'string', example: 'Americas' },
            subregion: { type: 'string', example: 'South America' },
            population: { type: 'integer', example: 215313498 },
            languages: {
              type: 'object',
              additionalProperties: { type: 'string' },
              example: { por: 'Portuguese' },
            },
            currencies: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  symbol: { type: 'string' },
                },
              },
              example: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
            },
            flags: {
              type: 'object',
              properties: {
                png: { type: 'string', example: 'https://flagcdn.com/w320/br.png' },
                svg: { type: 'string', example: 'https://flagcdn.com/br.svg' },
                alt: { type: 'string' },
              },
            },
            maps: {
              type: 'object',
              properties: {
                googleMaps: { type: 'string' },
                openStreetMaps: { type: 'string' },
              },
            },
            timezones: { type: 'array', items: { type: 'string' }, example: ['UTC-05:00'] },
            area: { type: 'number', example: 8515767 },
            latlng: { type: 'array', items: { type: 'number' }, example: [-10, -55] },
          },
        },

        // ── Error ────────────────────────────────────────────────────────────
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Descrição do erro.' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erro de validação.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'nome' },
                  message: { type: 'string', example: 'Nome não pode ser vazio' },
                },
              },
            },
          },
        },
      },

      // ── Reusable responses ───────────────────────────────────────────────
      responses: {
        Unauthorized: {
          description: 'Token JWT ausente ou inválido.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Token de autenticação não fornecido.' },
            },
          },
        },
        NotFound: {
          description: 'Recurso não encontrado.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Registro não encontrado.' },
            },
          },
        },
        Conflict: {
          description: 'Conflito — registro duplicado.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Registro já existe com esses dados.' },
            },
          },
        },
        BadRequest: {
          description: 'Dados inválidos ou campos obrigatórios ausentes.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' },
            },
          },
        },
        InternalError: {
          description: 'Erro interno do servidor.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { message: 'Erro interno do servidor.' },
            },
          },
        },
      },

      // ── Reusable parameters ──────────────────────────────────────────────
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Número da página (padrão: 1)',
          schema: { type: 'integer', default: 1, minimum: 1 },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Itens por página (padrão: 10)',
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Filtro por nome (case-insensitive)',
          schema: { type: 'string' },
        },
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do registro',
          schema: { type: 'integer' },
        },
      },
    },

    // ── Paths ───────────────────────────────────────────────────────────────
    paths: {
      // ── /health ────────────────────────────────────────────────────────────
      '/health': {
        get: {
          tags: ['Sistema'],
          summary: 'Health check',
          description: 'Verifica se o servidor está online.',
          responses: {
            200: {
              description: 'Servidor funcionando.',
              content: {
                'application/json': {
                  example: {
                    status: 'ok',
                    timestamp: '2024-06-10T12:00:00.000Z',
                    environment: 'development',
                  },
                },
              },
            },
          },
        },
      },

      // ── /auth/register ────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Cadastrar usuário',
          description: 'Cria uma nova conta de usuário e retorna um token JWT.',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } },
            },
          },
          responses: {
            201: {
              description: 'Usuário cadastrado com sucesso.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
          },
        },
      },

      // ── /auth/login ───────────────────────────────────────────────────────
      '/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Login',
          description: 'Autentica o usuário e retorna um token JWT. Use o token no botão **Authorize** (🔒) acima.',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: {
              description: 'Credenciais inválidas.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  example: { message: 'Credenciais inválidas.' },
                },
              },
            },
          },
        },
      },

      // ── /auth/me ──────────────────────────────────────────────────────────
      '/auth/me': {
        get: {
          tags: ['Autenticação'],
          summary: 'Dados do usuário logado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Dados do usuário autenticado.',
              content: {
                'application/json': {
                  example: {
                    user: {
                      id: 1,
                      nome: 'João Silva',
                      email: 'joao@email.com',
                      createdAt: '2024-01-01T00:00:00.000Z',
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // ── /continentes ──────────────────────────────────────────────────────
      '/continentes': {
        get: {
          tags: ['Continentes'],
          summary: 'Listar continentes',
          description: 'Retorna lista paginada de continentes com filtro opcional por nome.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
          ],
          responses: {
            200: {
              description: 'Lista de continentes.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Continent' } },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['Continentes'],
          summary: 'Criar continente',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ContinentBody' } },
            },
          },
          responses: {
            201: {
              description: 'Continente criado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Continent' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            409: { $ref: '#/components/responses/Conflict' },
          },
        },
      },

      '/continentes/{id}': {
        get: {
          tags: ['Continentes'],
          summary: 'Buscar continente por ID',
          description: 'Retorna o continente e a lista resumida de países vinculados.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'Continente encontrado.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/ContinentWithCountries' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['Continentes'],
          summary: 'Atualizar continente',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ContinentBody' } },
            },
          },
          responses: {
            200: {
              description: 'Continente atualizado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Continent' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['Continentes'],
          summary: 'Excluir continente',
          description: 'Remove o continente. Falha se houver países vinculados.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'Continente excluído com sucesso.',
              content: {
                'application/json': {
                  example: { message: 'Continente excluído com sucesso.' },
                },
              },
            },
            400: {
              description: 'Não é possível excluir: existem países vinculados.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  example: { message: 'Não é possível excluir: existem 3 país(es) vinculado(s) a este continente.' },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ── /paises ───────────────────────────────────────────────────────────
      '/paises': {
        get: {
          tags: ['Países'],
          summary: 'Listar países',
          description: 'Retorna lista paginada de países. Pode filtrar por nome e/ou continente.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
            {
              name: 'id_continente',
              in: 'query',
              description: 'Filtrar por ID do continente',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Lista de países.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Country' } },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['Países'],
          summary: 'Criar país',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CountryBody' } },
            },
          },
          responses: {
            201: {
              description: 'País criado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Country' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: {
              description: 'Continente não encontrado.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
            409: { $ref: '#/components/responses/Conflict' },
          },
        },
      },

      '/paises/{id}': {
        get: {
          tags: ['Países'],
          summary: 'Buscar país por ID',
          description: 'Retorna o país com seu continente e a lista resumida de cidades.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'País encontrado.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { data: { $ref: '#/components/schemas/Country' } },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['Países'],
          summary: 'Atualizar país',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CountryBody' } },
            },
          },
          responses: {
            200: {
              description: 'País atualizado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Country' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['Países'],
          summary: 'Excluir país',
          description: 'Remove o país. Falha se houver cidades vinculadas.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'País excluído com sucesso.',
              content: {
                'application/json': { example: { message: 'País excluído com sucesso.' } },
              },
            },
            400: {
              description: 'Não é possível excluir: existem cidades vinculadas.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  example: { message: 'Não é possível excluir: existem 5 cidade(s) vinculada(s) a este país.' },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ── /cidades ──────────────────────────────────────────────────────────
      '/cidades': {
        get: {
          tags: ['Cidades'],
          summary: 'Listar cidades',
          description: 'Retorna lista paginada de cidades. Pode filtrar por nome, país e/ou continente.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
            {
              name: 'id_pais',
              in: 'query',
              description: 'Filtrar por ID do país',
              schema: { type: 'integer' },
            },
            {
              name: 'id_continente',
              in: 'query',
              description: 'Filtrar por ID do continente',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Lista de cidades.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/City' } },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['Cidades'],
          summary: 'Criar cidade',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CityBody' } },
            },
          },
          responses: {
            201: {
              description: 'Cidade criada com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/City' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: {
              description: 'País não encontrado.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },

      '/cidades/{id}': {
        get: {
          tags: ['Cidades'],
          summary: 'Buscar cidade por ID',
          description: 'Retorna a cidade com dados do país e do continente.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'Cidade encontrada.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { data: { $ref: '#/components/schemas/City' } },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['Cidades'],
          summary: 'Atualizar cidade',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CityBody' } },
            },
          },
          responses: {
            200: {
              description: 'Cidade atualizada com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/City' },
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['Cidades'],
          summary: 'Excluir cidade',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'Cidade excluída com sucesso.',
              content: {
                'application/json': { example: { message: 'Cidade excluída com sucesso.' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ── /api-externas ─────────────────────────────────────────────────────
      '/api-externas/pais/{nome}': {
        get: {
          tags: ['APIs Externas'],
          summary: 'Dados do país (REST Countries)',
          description:
            'Consulta a [REST Countries API](https://restcountries.com) e retorna informações detalhadas: bandeira, capital, moeda, idiomas, fusos horários, mapas e mais.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'nome',
              in: 'path',
              required: true,
              description: 'Nome do país em inglês (ex: Brazil, France, Japan)',
              schema: { type: 'string', example: 'Brazil' },
            },
          ],
          responses: {
            200: {
              description: 'Dados externos do país.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { data: { $ref: '#/components/schemas/CountryExternal' } },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      '/api-externas/regiao/{regiao}': {
        get: {
          tags: ['APIs Externas'],
          summary: 'Países de uma região (REST Countries)',
          description:
            'Lista todos os países de uma região geográfica. Valores válidos: `Africa`, `Americas`, `Asia`, `Europe`, `Oceania`.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'regiao',
              in: 'path',
              required: true,
              description: 'Região geográfica',
              schema: {
                type: 'string',
                enum: ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'],
                example: 'Americas',
              },
            },
          ],
          responses: {
            200: {
              description: 'Lista simplificada de países da região.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            nome: { type: 'string' },
                            nomeOficial: { type: 'string' },
                            capital: { type: 'string' },
                            populacao: { type: 'integer' },
                            bandeira: { type: 'string' },
                            area: { type: 'number' },
                          },
                        },
                      },
                      total: { type: 'integer' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      '/api-externas/clima/cidade/{id}': {
        get: {
          tags: ['APIs Externas'],
          summary: 'Clima de cidade cadastrada (OpenWeatherMap)',
          description:
            'Busca o clima atual usando as coordenadas (latitude/longitude) de uma cidade já cadastrada no banco de dados. Requer `OPENWEATHER_API_KEY` configurada no `.env`.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da cidade cadastrada no banco',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Dados climáticos da cidade.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      cidade: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nome: { type: 'string' },
                          lat: { type: 'number' },
                          lon: { type: 'number' },
                        },
                      },
                      clima: { $ref: '#/components/schemas/WeatherData' },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
            503: {
              description: 'Serviço de clima indisponível (chave de API não configurada ou erro externo).',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  example: { message: 'Serviço de clima indisponível. Verifique a chave OPENWEATHER_API_KEY.' },
                },
              },
            },
          },
        },
      },

      '/api-externas/clima': {
        get: {
          tags: ['APIs Externas'],
          summary: 'Clima por coordenadas livres (OpenWeatherMap)',
          description: 'Retorna o clima atual para qualquer par de coordenadas geográficas.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'lat',
              in: 'query',
              required: true,
              description: 'Latitude',
              schema: { type: 'number', example: -23.5505 },
            },
            {
              name: 'lon',
              in: 'query',
              required: true,
              description: 'Longitude',
              schema: { type: 'number', example: -46.6333 },
            },
          ],
          responses: {
            200: {
              description: 'Dados climáticos.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { data: { $ref: '#/components/schemas/WeatherData' } },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            503: {
              description: 'Serviço de clima indisponível.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },

      '/api-externas/pais-enriquecido/{id}': {
        get: {
          tags: ['APIs Externas'],
          summary: 'País enriquecido (banco + REST Countries + clima)',
          description:
            'Endpoint combinado: retorna os dados do país do banco de dados **enriquecidos** com informações da REST Countries API (bandeira, mapa, fusos) e o clima atual via OpenWeatherMap — tudo em uma única chamada.',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: {
              description: 'País com dados enriquecidos de APIs externas.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        allOf: [
                          { $ref: '#/components/schemas/Country' },
                          {
                            type: 'object',
                            properties: {
                              dadosExternos: {
                                nullable: true,
                                type: 'object',
                                properties: {
                                  nomeOficial: { type: 'string' },
                                  capital: { type: 'string' },
                                  bandeira: { type: 'object' },
                                  escudoDeArmas: { type: 'object' },
                                  mapas: { type: 'object' },
                                  fusoHorario: { type: 'array', items: { type: 'string' } },
                                  area: { type: 'number' },
                                  subRegiao: { type: 'string' },
                                },
                              },
                              clima: {
                                nullable: true,
                                allOf: [{ $ref: '#/components/schemas/WeatherData' }],
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },
    },

    tags: [
      { name: 'Sistema', description: 'Health check e status do servidor' },
      { name: 'Autenticação', description: 'Registro, login e dados do usuário' },
      { name: 'Continentes', description: 'CRUD completo de continentes' },
      { name: 'Países', description: 'CRUD completo de países' },
      { name: 'Cidades', description: 'CRUD completo de cidades' },
      {
        name: 'APIs Externas',
        description: 'Integração com REST Countries e OpenWeatherMap',
      },
    ],
  },
  apis: [], // usamos definição inline acima
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
