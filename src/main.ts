import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT: number = parseInt(process.env.PORT, 10) || 3000;
  app.enableCors();
  await app.listen(PORT);
}

bootstrap();
