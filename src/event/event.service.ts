import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from 'src/model/event.model';
import { AddEventDto } from './dto/addEvent.dto';
import { Messages } from 'src/libs/utils/constants/message';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { User } from 'src/model/user.model';
import { EditEventDto } from './dto/editEvent.dto';
import { EventImage } from 'src/model/eventImage.model';
import { AddEventImageDto } from './dto/addEventImage.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event) private eventModel: typeof Event,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(EventImage) private eventImageModel: typeof EventImage,
  ) {}

  async addEvent(dto: AddEventDto) {
    try {
      const { event_name, event_description, user_id } = dto;

      const newEvent = await this.eventModel.create(dto as unknown as Event);

      Logger.log(`Event ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Event ${Messages.ADD_SUCCESS}`,
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error || error.message,
      );
    }
  }

  async editEvent(id: number, dto: EditEventDto) {
    try {
      const event = await this.eventModel.findByPk(id);

      if (!event) {
        Logger.error(`Event ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Event ${Messages.NOT_FOUND}`,
        );
      }

      await event.update(dto);

      Logger.log(`Event ${Messages.UPDATE_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        Messages.UPDATE_SUCCESS,
        `Event ${Messages.UPDATE_SUCCESS}`,
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        Logger.error(error.message || error),
      );
    }
  }

  async listOfEvents() {
    try {
      const events = await this.eventModel.findAll({
        attributes: [
          'id',
          'event_name',
          'event_description',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: this.userModel,
            attributes: [
              'id',
              'name',
              'email',
              'phone_number',
              'createdAt',
              'updatedAt',
            ],
          },
          {
            model: this.eventImageModel,
            attributes: ['id', 'image_path', 'event_id'],
          },
        ],
      });

      if (!events || events.length === 0) {
        Logger.error(`Events ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Events ${Messages.NOT_FOUND}`,
        );
      }

      Logger.log(`Events ${Messages.GET_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Events ${Messages.GET_SUCCESS}`,
        { events },
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error,
      );
    }
  }

  async viewEvent(id: number) {
    try {
      const event = await this.eventModel.findByPk(id, {
        attributes: [
          'id',
          'event_name',
          'event_description',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: this.userModel,
            attributes: [
              'id',
              'name',
              'email',
              'phone_number',
              'createdAt',
              'updatedAt',
            ],
          },
          {
            model: EventImage,
            attributes: ['id', 'image_path'],
          },
        ],
      });

      if (!event) {
        Logger.error(`Event ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Event ${Messages.NOT_FOUND}`,
        );
      }

      Logger.log(`Event ${Messages.GET_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Event ${Messages.GET_SUCCESS}`,
        { event },
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error,
      );
    }
  }

  async deleteEvent(id: number) {
    try {
      const event = await this.eventModel.findByPk(id);

      if (!event) {
        Logger.error(`Event ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Event ${Messages.NOT_FOUND}`,
        );
      }

      await event.destroy();

      Logger.log(`Event ${Messages.DELETED_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        Messages.DELETED_SUCCESS,
        `Event ${Messages.DELETED_SUCCESS}`,
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error,
      );
    }
  }

  async addEventImage(dto: AddEventImageDto) {
    try {
      const event = await this.eventModel.findOne({
        where: { id: dto.event_id },
      });

      if (!event) {
        Logger.error(`Event ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Event ${Messages.NOT_FOUND}`,
        );
      }

      const eventImage = await this.eventImageModel.create({
        image_path: dto.event_image,
        event_id: dto.event_id,
      });

      Logger.log(`Event images ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Event images ${Messages.ADD_SUCCESS}`,
        { id: eventImage.id },
      );
    } catch (error) {
      Logger.error(error.message);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        error.message || error,
      );
    }
  }
}
