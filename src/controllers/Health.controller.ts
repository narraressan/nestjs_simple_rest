import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthService } from 'src/services/Health.service';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Utils')
@Controller('health')
@UseGuards(ThrottlerGuard)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private indicator: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck(): Promise<HealthCheckResult> {
    return await this.health.check([
      (): Promise<HealthIndicatorResult> => this.indicator.swaggerUI(),
      (): Promise<HealthIndicatorResult> => this.indicator.swaggerJSON(),
      (): Promise<HealthIndicatorResult> => this.indicator.stats(),
      (): Promise<HealthIndicatorResult> => this.indicator.db(),
    ]);
  }
}
