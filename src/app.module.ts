import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneModule } from './modules/drone/drone.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { OrderModule } from './modules/order/order.module';
import { RoutesGateway } from './modules/order/routes/routes.gateway';

@Module({
  imports: [ConfigModule.forRoot(), DroneModule, WarehouseModule, UserModule, AdminModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, RoutesGateway],
})
export class AppModule {}
