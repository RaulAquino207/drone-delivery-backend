import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { getDistance } from 'geolib';
import { PrismaService } from '../../database/prisma.service';
import { DroneStatusEnum } from '../drone/enum/drone-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatusEnum } from './enum/order-status.enum';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  lineBetweenPoints(origin, destination) {
    const { latitude: lat1, longitude: lng1 } = origin;
    const { latitude: lat2, longitude: lng2 } = destination;

    const m = (lat2 - lat1) / (lng2 - lng1);
    const b = lat1 - m * lng1;

    return {
      slope: m,
      intercept: b,
      equation: (lng) => m * lng + b,
    };
  }

  async nearestWarehouseCoordinates(coordinates: number[]) {
    
    const warehousesCoordinates = await this.prismaService.warehouse.findMany({
      where: {
        drones: {
          some: {
            status: DroneStatusEnum.IDLE,
          },
        },
      },
      include: {
        position: true,
        drones: {
          where: {
            status: DroneStatusEnum.IDLE
          }
        }
      },
    });

   if(JSON.stringify(warehousesCoordinates) === "[]") {
    return null;
   } else {
    const origin = {
      latitude: coordinates[0],
      longitude: coordinates[1],
    };

    warehousesCoordinates.map((warehouseCoordinate) => {
      const destination = {
        latitude: warehouseCoordinate.position.latitude,
        longitude: warehouseCoordinate.position.longitude,
      };

      Object.assign(warehouseCoordinate, {
        distance: getDistance(origin, destination),
      });
    });

    const warehouseWithShorterDistance = warehousesCoordinates
      .sort((warehouseA, warehouseB) => {
        return warehouseA['distance'] - warehouseB['distance'];
      })
      .slice(0, 1)[0];

    const line = this.lineBetweenPoints(origin, {
      latitude: warehouseWithShorterDistance.position.latitude,
      longitude: warehouseWithShorterDistance.position.longitude,
    });

    const numPoints = warehouseWithShorterDistance['distance'];
    const lngStep =
      (warehouseWithShorterDistance.position.longitude - coordinates[1]) /
      numPoints;

    let route = [];
    for (let i = 0; i <= numPoints; i++) {
      const lng = coordinates[1] + i * lngStep;
      const lat = line.equation(lng);
      route.push([lat, lng]);
    }

    route = route.reverse();

    // const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinates[0]}, ${coordinates[1]}&destinations=${warehousesCoordinates[0].position.latitude}, ${warehousesCoordinates[0].position.longitude}&key=${process.env.GOOGLE_API_KEY}`);
    // console.log(response.data.destination_addresses)
    // console.log(response.data.origin_addresses)
    // console.log("???? ~ file: order.service.ts:32 ~ OrderService ~ nearestWarehouseCoordinates ~ response", response.data.rows[0].elements[0].distance)
    // console.log("???? ~ file: order.service.ts:32 ~ OrderService ~ nearestWarehouseCoordinates ~ response", response.data.rows[0].elements[0].duration)

    return {
      warehouseWithShorterDistance,
      route
    };
   }
  }

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: createOrderDto.user_id,
      },
      select: {
        position: true,
      },
    });

    const warehouseWithShorterDistanceAndRoute = await this.nearestWarehouseCoordinates([
      user.position.latitude,
      user.position.longitude,
    ]);

    if(warehouseWithShorterDistanceAndRoute == null) {
      throw new HttpException(`No drones at the moment :(`, HttpStatus.BAD_REQUEST);
    }

    const drone = warehouseWithShorterDistanceAndRoute.warehouseWithShorterDistance.drones[Math.floor(Math.random() * warehouseWithShorterDistanceAndRoute.warehouseWithShorterDistance.drones.length)];

    await this.prismaService.drone.update({
      where: {
        id: drone.id
      },
      data: {
        status: DroneStatusEnum.ONROUTE
      }
    });

    const sectionId = uuidv4();

    const order = await this.prismaService.order.create({
      data: {
        status: OrderStatusEnum.BEINGDELIVERED,
        userId: createOrderDto.user_id,
        section: String(sectionId),
        warehouseId: warehouseWithShorterDistanceAndRoute.warehouseWithShorterDistance.id,
        droneId: drone.id,
      },
      include: {
        drone: {
          include: {
            position: true
          }
        },
        warehouse: {
          include: {
            position: true
          }
        }
      }
    });

    return Object.assign(order, {
      route: warehouseWithShorterDistanceAndRoute.route
    });
  }

  async findAll() {
    return await this.prismaService.order.findMany({
      include: {
        user: true,
        drone: true,
        warehouse: true
      }
    });
  }

  async getActiveSections(id: string){
    return await this.prismaService.order.findMany({
      where: {
        userId: id,
        status: OrderStatusEnum.BEINGDELIVERED
      }, 
      include: {
        user: true,
        drone: true,
        warehouse: true
      }
    });
  }

  async finalizeOrder(id: string){
    await this.prismaService.order.update({
      where: {
        id: id
      },
      data: {
        status: OrderStatusEnum.DELIVERED
      }
    })
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}

