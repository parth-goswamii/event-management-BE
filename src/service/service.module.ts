import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from 'src/model/service.model';
import { Event } from 'src/model/event.model';

@Module({
  imports: [SequelizeModule.forFeature([Event, Service])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
