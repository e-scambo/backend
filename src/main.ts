import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/module/app.module';
import { MorganLogger } from './config/logger/morgan.logger';
import { TimeoutInterceptor } from './config/interceptor/timeout.interceptor';
import { AllExceptionsFilter } from './config/filter/exception.filter';
import { Swagger } from './presentation/swagger/swagger';

async function bootstrap() {
  const { PORT } = process.env;
  const { CLIENT } = process.env;
  const app = await NestFactory.create(AppModule);

  const whitelist = [CLIENT];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  setMiddlewares(app);
  await app.listen(PORT);
}

function setMiddlewares(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  MorganLogger.config(app);
  Swagger.config(app);
}

bootstrap();
