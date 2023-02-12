import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {

  constructor(private prismaService: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    try {
      return await this.prismaService.warehouse.create({
        data: {
          name: createWarehouseDto.name,
          position: {
            create: {
              latitude: +createWarehouseDto.latitude,
              longitude: +createWarehouseDto.longitude
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException(
        `Internal error when creating warehouse`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await  this.prismaService.warehouse.findMany({
        include: {
          position: true,
          admin: true,
          drones: true,
          orders: true,
        }
      });
    } catch (error) {
      throw new HttpException(
        `Internal error when creating warehouse`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} warehouse`;
  // }

  // update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
  //   return `This action updates a #${id} warehouse`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} warehouse`;
  // }
}
