import { ApiResponseProperty } from '@nestjs/swagger';

export class ReadOnlyResponse {
  @ApiResponseProperty({
    example: '2021-12-02T00:00:00.000Z',
  })
  created_at: string;

  @ApiResponseProperty({
    example: '2021-12-02T00:00:00.000Z',
  })
  update_at: string;

  @ApiResponseProperty({
    example: '61a8e6456ec94e22a0c12a76',
  })
  id: string;
}
