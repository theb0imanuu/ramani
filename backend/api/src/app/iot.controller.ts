import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TelemetryDto } from '@ramani/shared';
import { MetersService } from './meters/meters.service';

@Controller('iot')
export class IotController {
  private readonly logger = new Logger(IotController.name);

  constructor(private readonly metersService: MetersService) {}

  @Post('telemetry')
  async receiveTelemetry(@Body() data: TelemetryDto) {
    this.logger.log(`Received: Device ${data.deviceId} | Flow: ${data.flowRate} L/m`);

    // Persist flow rate
    await this.metersService.updateFlowRate(data.deviceId, data.flowRate);

    // Simple Leak Detection Logic
    if (data.flowRate > 500) {
      this.logger.error(`🚨 BURST DETECTED on device ${data.deviceId}!`);
    }

    return { status: 'acknowledged' };
  }
}