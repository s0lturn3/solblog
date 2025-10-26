/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply our interceptor to standardize the return structure
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Apply global validation so that if required parameters are not provided it throws a 400 - Bad Request
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      return new BadRequestException(
        errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        })),
      );
    },
  }));


  // API URI versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });


  // #region Swagger configuration

  // TODO: Implement JWT authentication in Swagger
  const config = new DocumentBuilder()
    .setTitle('SolBlog')
    .setDescription('APIs used in my persoal blog: SolBlog')
    .setContact('Solturne', 'https://solturne.dev', 'erickcarvalho.contato20@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .addTag('Posts', 'Endpoints related to blog posts')
    .addTag('Users', 'Endpoints related to users management')
    .addTag('Tags', 'Endpoints related to tags management')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     description: 'Informe o token JWT',
    //     in: 'header'
    //   },
    //   'access-token'
    // )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== 'production') SwaggerModule.setup('api', app, document);

  // #endregion Swagger configuration


  // CORS configuration
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
      res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization');
      res.sendStatus(204); // No Content
    } else {
      next();
    }
  });

  app.enableCors();


  // Start the application
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
