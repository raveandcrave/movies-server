import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {ValidationPipe} from './pipes/validation.pipe';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {cors: true});

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movies Project')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addTag('Viktor Kopan')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
}

start();
