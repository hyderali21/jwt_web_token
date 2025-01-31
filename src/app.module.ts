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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';



console.log('USERNAME:', process.env.USERNAME_D);
console.log('PASSWORD:', process.env.PASSWORD_D );
console.log('DATABASE_NAME:', process.env.DATABASE_NAME);


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: process.env.USERNAME_D,
        password: process.env.PASSWORD_D,
        database: process.env.DATABASE_NAME,
        entities: [User],
        synchronize: true,
      })

    }),
    ThrottlerModule.forRoot([{
      ttl: 10 * 1000,
      limit: 5,
    }]),

    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },

    AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users/:id');
  }
}