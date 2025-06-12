import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import * as cors from 'cors';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = new ConfigService();
  const PORT: number = env.get('PORT') || 3000;
  app.setGlobalPrefix('api');
  app.use(morgan('dev'));
  app.use(cors());
  await app.listen(PORT, () => console.log('server ready on port ' + PORT));
}
bootstrap();
