import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DroneService } from './drone.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

@ApiTags('Drone')
@Controller('drone')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  create(@Body() createDroneDto: CreateDroneDto) {
    return this.droneService.create(createDroneDto);
  }

  @Get()
  findAll() {
    return this.droneService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.droneService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.droneService.returnToIdle(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.droneService.remove(+id);
  // }
}
