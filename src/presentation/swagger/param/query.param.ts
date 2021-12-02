import { ApiProperty } from '@nestjs/swagger';

class QueryParam {
  @ApiProperty({
    example: 100,
    description: `Limite de dados. Para mais informações, acesse esse 
    <a href="https://www.npmjs.com/package/nest-mongo-query-parser#pagination" target="_blank">link</a>.`,
    required: false,
  })
  limit: number;

  @ApiProperty({
    example: 0,
    description: `Deslocamento de dados. Para mais informações, acesse esse 
    <a href="https://www.npmjs.com/package/nest-mongo-query-parser#pagination" target="_blank">link</a>.`,
    required: false,
  })
  skip: number;

  @ApiProperty({
    required: false,
    description: `Paginação dos dados. Esse parâmetro é utilizado para fazer o deslocamento dos dados com base na
     quantidade especificada no limite. Para mais informações, acesse esse 
     <a href="https://www.npmjs.com/package/nest-mongo-query-parser#pagination" target="_blank">link</a>.`,
  })
  page: number;

  @ApiProperty({
    description: `Ordenação dos dados. Para ordenação crescente, basta indicar o campo. Para ordenação decrescente,
     adicione um símbolo de "-" antes do nome do campo. Utilize vírgulas para múltiplos campos de ordenação.
     Para mais informações, acesse esse 
     <a href="https://www.npmjs.com/package/nest-mongo-query-parser#ordering" target="_blank">link</a>. 
    `,
    required: false,
    example: '',
  })
  sort: string;

  @ApiProperty({
    description: `Seleção dos dados. Para escolher quais campos devem ser retornados, adicione o nome do campo.
     Para selecionar os campos que não devem ser retornados, adicione um símbolo de "-" antes do nome do campo.
     Utilize vírgulas para múltiplos campos de seleção. Para mais informações, acesse esse 
     <a href="https://www.npmjs.com/package/nest-mongo-query-parser#select" target="_blank">link</a>.     `,
    required: false,
    example: '',
  })
  select: string;
}

export const ApiQueryParam = {
  type: QueryParam,
};
