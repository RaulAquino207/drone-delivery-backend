import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    try {

      await this.prismaService.warehouse.findUniqueOrThrow({
        where: {
          id: createAdminDto.warehouse_id
        }
      });

      return await this.prismaService.admin.create({
        data: {
          name: createAdminDto.name,
          email: createAdminDto.email,
          warehouseId: createAdminDto.warehouse_id
        }
      })
    } catch (error) {
      throw new HttpException(
        `Internal error when creating warehouse administrator`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prismaService.admin.findMany({
      include: {
        warehouse: true
      }
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.admin.findFirst({
      include: {
        warehouse: true,
      },
      where: {
        email: email
      }
    });
  }

  async findOne(id: string) {
    return this.prismaService.admin.findFirst({
      include: {
        warehouse: true
      },
      where: {
        id
      }
    });
  }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
