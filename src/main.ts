import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  
  if(process.env.NODE_ENV == 'development') {
    const config = new DocumentBuilder()
    .setTitle('Drone Delivery')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    Logger.log(`Documentation available at http://localhost:${process.env.PORT}/api`)
  }

  await app.listen(process.env.PORT || 3000, () => {
    Logger.log(`[PORT]: ${process.env.PORT || 3000}`);
  });
}
bootstrap();
