import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import sequelize from './database';
import '../models'; // carrega todos os modelos

dotenv.config();

const databaseName = process.env.DB_NAME || 'geo_crud';
const databaseHost = process.env.DB_HOST || 'localhost';
const databasePort = Number(process.env.DB_PORT) || 5432;
const databaseUser = process.env.DB_USER || 'postgres';
const databasePassword = process.env.DB_PASSWORD || '';

async function ensureDatabaseExists(): Promise<void> {
  const maintenanceConnection = new Sequelize('postgres', databaseUser, databasePassword, {
    host: databaseHost,
    port: databasePort,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await maintenanceConnection.authenticate();

    const [result] = await maintenanceConnection.query(
      'SELECT 1 FROM pg_database WHERE datname = :databaseName',
      {
        replacements: { databaseName },
      }
    );

    if (Array.isArray(result) && result.length > 0) {
      return;
    }

    await maintenanceConnection.query(`CREATE DATABASE "${databaseName}"`);
    console.log(`✅ Banco de dados "${databaseName}" criado com sucesso.`);
  } finally {
    await maintenanceConnection.close();
  }
}

async function syncDatabase(): Promise<void> {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    // alter: true atualiza tabelas existentes sem recriar
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com sucesso.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase();
