import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.user_name,
          position: {
            create: {
              latitude: +createUserDto.latitude,
              longitude: +createUserDto.longitude
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException(
        `Internal error when creating user`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      include: {
        orders: true,
        position: true
      }
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
