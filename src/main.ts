import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IEnvironmentVariables } from './config/EnvironmentVariables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<IEnvironmentVariables>>(ConfigService);

  const port = configService.get('PORT');
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
