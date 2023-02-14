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
        },
        include: {
          position: true
        },
      });

      const position = await this.prismaService.position.create({
        data: {
          latitude: warehouse.position.latitude,
          longitude: warehouse.position.longitude
        }
      })

      return await this.prismaService.drone.create({
        data: {
          identifier: `${warehouse.name}_${await this.prismaService.drone.count({
            where: {
              warehouseId: warehouse.id
            }
          }) + 1}`,
          status: DroneStatusEnum.IDLE,
          speed: createDroneDto.speed,
          warehouseId: warehouse.id,
          positionId: position.id
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

    const warehouse = await this.prismaService.drone.findFirst({
      where: {
        id: id
      },
      select: {
        warehouse: {
          select: {
            position: true
          }
        }
      }
    })

    return await this.prismaService.drone.update({
      where: {
        id
      },
      data: {
        status: DroneStatusEnum.IDLE,
        position: {
          update: {
            latitude: warehouse.warehouse.position.latitude,
            longitude: warehouse.warehouse.position.longitude
          }
        }
      }
    })
  }

  async updateCoordinates(id: string, coordinates: number[]) {
    return await this.prismaService.drone.update({
      where: {
        id
      },
      data: {
        position: {
          update: {
            latitude: coordinates[0],
            longitude: coordinates[1]
          }
        }
      },
      include: {
        position: true
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
