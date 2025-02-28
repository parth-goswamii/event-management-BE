import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from 'src/model/service.model';
import { AddServiceDto } from './dto/addService.dto';
import { Messages } from 'src/libs/utils/constants/message';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import { User } from 'src/model/user.model';
import { Event } from 'src/model/event.model';
import { EditServiceDto } from './dto/editService.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service) private serviceModel: typeof Service,
    @InjectModel(Event) private eventModel: typeof Event,
  ) {}

  async addService(dto: AddServiceDto) {
    try {
      const { event_id, service_name, service_description, price } = dto;

      const newService = await this.serviceModel.create(dto as any as Service);
      let id= newService.id

      Logger.log(`Service ${Messages.ADD_SUCCESS}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Service ${Messages.ADD_SUCCESS}`,
        {id}
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

  async listOfServices() {
    try {
      const services = await this.serviceModel.findAll({
        attributes: [
          'id',
          'service_name',
          'service_description',
          'price',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: this.eventModel,
            attributes: [
              'id',
              'event_name',
              'event_description',
              'createdAt',
              'updatedAt',
            ],
          },
        ],
      });

      if (!services || services.length === 0) {
        Logger.error(`Services ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Services ${Messages.NOT_FOUND}`,
        );
      }

      Logger.log(`Services ${Messages.GET_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Services ${Messages.GET_SUCCESS}`,
        { services },
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

  async editService(id: number, dto: EditServiceDto) {
    try {
      const service = await this.serviceModel.findByPk(id);

      if (!service) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Service ${Messages.NOT_FOUND}`,
        );
      }

      await service.update(dto);
      Logger.log(`Service ${Messages.UPDATE_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        Messages.UPDATE_SUCCESS,
        `Service ${Messages.UPDATE_SUCCESS}`,
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

  async viewService(id: number) {
    try {
      const service = await this.serviceModel.findByPk(id, {
        attributes: [
          'id',
          'service_name',
          'service_description',
          'price',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: this.eventModel,
            attributes: [
              'id',
              'event_name',
              'event_description',
              'createdAt',
              'updatedAt',
            ],
          },
        ],
      });

      if (!service) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Service ${Messages.NOT_FOUND}`,
        );
      }

      Logger.log(`Service ${Messages.GET_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Service ${Messages.GET_SUCCESS}`,
        { service },
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

  async deleteService(id: number) {
    try {
      const service = await this.serviceModel.findByPk(id);

      if (!service) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Service ${Messages.NOT_FOUND}`,
        );
      }

      await service.destroy();

      Logger.log(`Service ${Messages.DELETED_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        Messages.DELETED_SUCCESS,
        `Service ${Messages.DELETED_SUCCESS}`,
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
