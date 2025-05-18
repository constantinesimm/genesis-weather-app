import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function runMigrations() {
  // створюємо контекст (не HTTP-сервер)
  const appCtx = await NestFactory.createApplicationContext(AppModule);

  // викликаємо runMigrations() з TypeORM DataSource
  const ds = appCtx.get(DataSource);
  await ds.runMigrations();

  console.log('✅ Міграції виконано');
  await appCtx.close();
}

runMigrations().catch((err) => {
  console.error('❌ Помилка при міграціях:', err);
  process.exit(1);
});
