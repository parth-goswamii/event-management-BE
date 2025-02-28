import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { JwtStrategy } from './libs/service/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ServiceModule } from './service/service.module';

dotenv.config();

const config: any = {
  dialect: 'mysql',
  autoLoadModels: true,
  models: [],
  define: {
    timestamps: false,
  },
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      ...config,
      host: process.env.DATABASE_HOST,
      port: process.env.DB_PORT,
      username: process.env.DATABASE_USERS,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      timezone: '+05:30',
    }),
    JwtModule.register({
      secret: 'JWTSecretKey',
      signOptions: { expiresIn: '30d' },
    }),
    MulterModule.register({
      dest: './public/uploads',
    }),
    UserModule,
    EventModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
