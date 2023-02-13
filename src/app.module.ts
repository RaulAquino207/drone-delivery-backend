import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneModule } from './modules/drone/drone.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [ConfigModule.forRoot(), DroneModule, WarehouseModule, UserModule, AdminModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
