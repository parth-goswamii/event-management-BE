import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from 'src/model/event.model';
import { User } from 'src/model/user.model';
import { EventImage } from 'src/model/eventImage.model';

@Module({
  imports: [SequelizeModule.forFeature([Event, User, EventImage])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
