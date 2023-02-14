import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DroneService } from '../../drone/drone.service';
import { OrderService } from '../order.service';

@WebSocketGateway(+process.env.SOCKET_PORT)
export class RoutesGateway {

  constructor(
    private orderService: OrderService,
    private droneService: DroneService
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {

    const order = await this.orderService.create({
      user_id: payload.userId,
      section_id: payload.sectionId
    });

    let jump = 0;
    let coordinates = setInterval(async () => {      
      if (order.route[jump] == undefined) {
        this.droneService.returnToIdle(order.drone.id);
        this.orderService.finalizeOrder(order.id);
        clearInterval(coordinates)
      } else {
        const drone = await this.droneService.updateCoordinates(order.drone.id, order.route[jump])

        this.server.emit(payload.sectionId, {
          message: [drone.position.latitude, drone.position.longitude],
          sectionId: payload.sectionId
        })
      }
      jump += order.drone.speed;
    }, 1000);
  }
}
