import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { HealthOkResponse } from '../swagger/response/health.response';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private service: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  @Get()
  @ApiProduces('application/json')
  @ApiOkResponse(HealthOkResponse)
  healthCheck() {
    return this.service.check([() => this.mongooseHealth.pingCheck('mongoDB')]);
  }
}
