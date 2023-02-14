import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { DroneStatusEnum } from './enum/drone-status.enum';

@Injectable()
export class DroneService {

  constructor(private prismaService: PrismaService) {}

  async create(createDroneDto: CreateDroneDto) {

    try {
      const warehouse = await this.prismaService.warehouse.findUniqueOrThrow({
        where: {
          id: createDroneDto.warehouse_id
        }
      });

      return await this.prismaService.drone.create({
        data: {
          identifier: `${warehouse.name}_${await this.prismaService.drone.count({
            where: {
              warehouseId: warehouse.id
            }
          }) + 1}`,
          status: DroneStatusEnum.IDLE,
          speed: createDroneDto.speed,
          warehouseId: warehouse.id
        }
      })
    } catch (error) {
      throw new HttpException(
        `Internal error creating drone from a warehouse`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prismaService.drone.findMany({
      include: {
        warehouse: true
      }
    });
  }

  async returnToIdle(id: string){
    return await this.prismaService.drone.update({
      where: {
        id
      },
      data: {
        status: DroneStatusEnum.IDLE,
      }
    })
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} drone`;
  // }

  // update(id: number, updateDroneDto: UpdateDroneDto) {
  //   return `This action updates a #${id} drone`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} drone`;
  // }
}
