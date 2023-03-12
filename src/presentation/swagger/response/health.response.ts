import { ApiResponseProperty } from '@nestjs/swagger';

class MongoDBStatusUp {
  @ApiResponseProperty({
    example: { status: 'up' },
  })
  mongoDB: object;
}

class HealthResponse {
  @ApiResponseProperty({
    example: 'ok',
  })
  status: string;

  @ApiResponseProperty()
  info: MongoDBStatusUp;

  @ApiResponseProperty({
    example: {},
  })
  error: object;

  @ApiResponseProperty()
  details: MongoDBStatusUp;
}

export const HealthOkResponse = {
  description: 'Dados de saúde da aplicação retornados com sucesso.',
  type: HealthResponse,
};
