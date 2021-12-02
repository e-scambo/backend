import { ApiProperty } from '@nestjs/swagger';

class QueryParam {
  @ApiProperty({
    example: 100,
    description: 'Limite de dados.',
    required: false,
  })
  limit: number;

  @ApiProperty({
    example: 0,
    description: 'Deslocamento de dados.',
    required: false,
  })
  skip: number;

  @ApiProperty({
    description: `Ordenação dos dados. Para ordenação crescente, basta indicar o campo. Para ordenação decrescente,
     adicione um símbolo de "-" antes do nome do campo. Utilize vírgulas para múltiplos campos de ordenação.
    `,
    required: false,
    example: '',
  })
  sort: string;

  @ApiProperty({
    description: `Seleção dos dados. Para escolher quais campos devem ser retornados, adicione o nome do campo.
     Para selecionar os campos que não devem ser retornados, adicione um símbolo de "-" antes do nome do campo.
     Utilize vírgulas para múltiplos campos de seleção. 
     
     Observações:

     * Utilize apenas uma forma de seleção. Caso você utilize as duas formas, apenas os campos que devem ser 
     retornados serão priorizados. 

     * O id sempre será retornado, a não ser que você especifique que ele não seja retornado. Nesse caso, utilize 
     notação do MongoDB para id (_id).

     `,
    required: false,
    example: '',
  })
  select: string;
}

export const ApiQueryParam = {
  type: QueryParam,
};
