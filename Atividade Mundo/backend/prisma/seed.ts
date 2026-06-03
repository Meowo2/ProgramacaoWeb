import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.cidade.deleteMany();
  await prisma.pais.deleteMany();
  await prisma.continente.deleteMany();
  await prisma.usuario.deleteMany();

  // Criar usuário admin
  const senhaHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@mundo.com',
      senha: senhaHash,
    },
  });

  // Criar continentes
  const continentes = await Promise.all([
    prisma.continente.create({
      data: {
        nome: 'América do Sul',
        descricao: 'Continente localizado no hemisfério sul, conhecido pela biodiversidade e cultura diversificada.',
      },
    }),
    prisma.continente.create({
      data: {
        nome: 'América do Norte',
        descricao: 'Continente que inclui Estados Unidos, Canadá e México, entre outros.',
      },
    }),
    prisma.continente.create({
      data: {
        nome: 'Europa',
        descricao: 'Continente com grande diversidade cultural e histórica, berço de muitas civilizações.',
      },
    }),
    prisma.continente.create({
      data: {
        nome: 'Ásia',
        descricao: 'Maior continente do mundo, com a maior população e grande diversidade cultural.',
      },
    }),
    prisma.continente.create({
      data: {
        nome: 'África',
        descricao: 'Continente com a maior diversidade étnica e linguística do mundo.',
      },
    }),
    prisma.continente.create({
      data: {
        nome: 'Oceania',
        descricao: 'Continente composto por ilhas do Pacífico, incluindo Austrália e Nova Zelândia.',
      },
    }),
  ]);

  const [americaSul, americaNorte, europa, asia, africa, oceania] = continentes;

  // Criar países
  const paises = await Promise.all([
    // América do Sul
    prisma.pais.create({
      data: {
        nome: 'Brasil',
        populacao: 214000000,
        idioma_oficial: 'Português',
        moeda: 'Real (BRL)',
        id_continente: americaSul.id,
      },
    }),
    prisma.pais.create({
      data: {
        nome: 'Argentina',
        populacao: 46000000,
        idioma_oficial: 'Espanhol',
        moeda: 'Peso Argentino (ARS)',
        id_continente: americaSul.id,
      },
    }),
    // América do Norte
    prisma.pais.create({
      data: {
        nome: 'Estados Unidos',
        populacao: 332000000,
        idioma_oficial: 'Inglês',
        moeda: 'Dólar Americano (USD)',
        id_continente: americaNorte.id,
      },
    }),
    prisma.pais.create({
      data: {
        nome: 'Canadá',
        populacao: 40000000,
        idioma_oficial: 'Inglês / Francês',
        moeda: 'Dólar Canadense (CAD)',
        id_continente: americaNorte.id,
      },
    }),
    // Europa
    prisma.pais.create({
      data: {
        nome: 'Portugal',
        populacao: 10300000,
        idioma_oficial: 'Português',
        moeda: 'Euro (EUR)',
        id_continente: europa.id,
      },
    }),
    prisma.pais.create({
      data: {
        nome: 'França',
        populacao: 68000000,
        idioma_oficial: 'Francês',
        moeda: 'Euro (EUR)',
        id_continente: europa.id,
      },
    }),
    prisma.pais.create({
      data: {
        nome: 'Alemanha',
        populacao: 84000000,
        idioma_oficial: 'Alemão',
        moeda: 'Euro (EUR)',
        id_continente: europa.id,
      },
    }),
    // Ásia
    prisma.pais.create({
      data: {
        nome: 'Japão',
        populacao: 125000000,
        idioma_oficial: 'Japonês',
        moeda: 'Iene (JPY)',
        id_continente: asia.id,
      },
    }),
    prisma.pais.create({
      data: {
        nome: 'China',
        populacao: 1410000000,
        idioma_oficial: 'Mandarim',
        moeda: 'Yuan (CNY)',
        id_continente: asia.id,
      },
    }),
    // África
    prisma.pais.create({
      data: {
        nome: 'África do Sul',
        populacao: 60000000,
        idioma_oficial: 'Inglês / Zulu / Áfricaans',
        moeda: 'Rand (ZAR)',
        id_continente: africa.id,
      },
    }),
    // Oceania
    prisma.pais.create({
      data: {
        nome: 'Austrália',
        populacao: 26000000,
        idioma_oficial: 'Inglês',
        moeda: 'Dólar Australiano (AUD)',
        id_continente: oceania.id,
      },
    }),
  ]);

  const [brasil, argentina, eua, canada, portugal, franca, alemanha, japao, china, africaSul, australia] = paises;

  // Criar cidades
  await Promise.all([
    // Brasil
    prisma.cidade.create({
      data: { nome: 'São Paulo', populacao: 12300000, latitude: -23.5505, longitude: -46.6333, id_pais: brasil.id },
    }),
    prisma.cidade.create({
      data: { nome: 'Rio de Janeiro', populacao: 6750000, latitude: -22.9068, longitude: -43.1729, id_pais: brasil.id },
    }),
    prisma.cidade.create({
      data: { nome: 'Brasília', populacao: 3050000, latitude: -15.7975, longitude: -47.8919, id_pais: brasil.id },
    }),
    // Argentina
    prisma.cidade.create({
      data: { nome: 'Buenos Aires', populacao: 3070000, latitude: -34.6037, longitude: -58.3816, id_pais: argentina.id },
    }),
    // EUA
    prisma.cidade.create({
      data: { nome: 'Nova York', populacao: 8340000, latitude: 40.7128, longitude: -74.006, id_pais: eua.id },
    }),
    prisma.cidade.create({
      data: { nome: 'Los Angeles', populacao: 3980000, latitude: 34.0522, longitude: -118.2437, id_pais: eua.id },
    }),
    // Canadá
    prisma.cidade.create({
      data: { nome: 'Toronto', populacao: 2930000, latitude: 43.6532, longitude: -79.3832, id_pais: canada.id },
    }),
    // Portugal
    prisma.cidade.create({
      data: { nome: 'Lisboa', populacao: 545000, latitude: 38.7223, longitude: -9.1393, id_pais: portugal.id },
    }),
    prisma.cidade.create({
      data: { nome: 'Porto', populacao: 249000, latitude: 41.1579, longitude: -8.6291, id_pais: portugal.id },
    }),
    // França
    prisma.cidade.create({
      data: { nome: 'Paris', populacao: 2160000, latitude: 48.8566, longitude: 2.3522, id_pais: franca.id },
    }),
    // Alemanha
    prisma.cidade.create({
      data: { nome: 'Berlim', populacao: 3750000, latitude: 52.52, longitude: 13.405, id_pais: alemanha.id },
    }),
    // Japão
    prisma.cidade.create({
      data: { nome: 'Tóquio', populacao: 14000000, latitude: 35.6762, longitude: 139.6503, id_pais: japao.id },
    }),
    // China
    prisma.cidade.create({
      data: { nome: 'Pequim', populacao: 21500000, latitude: 39.9042, longitude: 116.4074, id_pais: china.id },
    }),
    // África do Sul
    prisma.cidade.create({
      data: { nome: 'Cidade do Cabo', populacao: 4700000, latitude: -33.9249, longitude: 18.4241, id_pais: africaSul.id },
    }),
    // Austrália
    prisma.cidade.create({
      data: { nome: 'Sydney', populacao: 5300000, latitude: -33.8688, longitude: 151.2093, id_pais: australia.id },
    }),
  ]);

  console.log('Seed concluído!');
  console.log('- 1 usuário admin (admin@mundo.com / admin123)');
  console.log('- 6 continentes');
  console.log('- 11 países');
  console.log('- 15 cidades');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
