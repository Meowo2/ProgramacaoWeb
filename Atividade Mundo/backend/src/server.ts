import app from './app';
import sequelize from './config/database';
import './models'; // carrega todos os models e associações

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    // Testa conexão com o banco
    await sequelize.authenticate();
    console.log('✅ Conexão com o PostgreSQL estabelecida.');

    // Sincroniza modelos (não recria tabelas existentes)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados com o banco.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 Swagger UI:      http://localhost:${PORT}/docs`);
      console.log(`📄 Swagger JSON:    http://localhost:${PORT}/docs.json`);
      console.log('\n📌 Rotas disponíveis:');
      console.log(`   POST   /auth/register`);
      console.log(`   POST   /auth/login`);
      console.log(`   GET    /auth/me`);
      console.log(`   GET    /continentes`);
      console.log(`   GET    /paises`);
      console.log(`   GET    /cidades`);
      console.log(`   GET    /api-externas/pais/:nome`);
      console.log(`   GET    /api-externas/clima/cidade/:id`);
      console.log(`   GET    /api-externas/pais-enriquecido/:id`);
      console.log(`   GET    /health`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
