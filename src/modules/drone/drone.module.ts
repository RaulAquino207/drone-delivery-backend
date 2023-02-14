import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [DroneController],
  providers: [DroneService, PrismaService],
  exports: [DroneService]
})
export class DroneModule {}
