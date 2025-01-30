import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { AuthMiddleware } from './auth/middlerware/auth.middleware';

import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Oneclick1@',
      database: 'nest-auth',
      entities: [User],
      synchronize: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 5*1000,
      limit: 3,
    }]),
  
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); 
}
}