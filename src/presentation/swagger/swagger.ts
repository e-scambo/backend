import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  static config(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('e-scambo: backend')
      .setDescription('Aplicação backend que faz parte da plataforma e-scambo')
      .setVersion('1.0.0')
      .addServer(`http://localhost:${process.env.PORT}`, 'Local HTTP Instance')
      .setLicense(
        'Apache 2.0',
        'http://www.apache.org/licenses/LICENSE-2.0.html',
      )
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
  }
}
