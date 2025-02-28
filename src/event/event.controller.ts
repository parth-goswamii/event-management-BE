import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AddEventDto } from './dto/addEvent.dto';
import { EditEventDto } from './dto/editEvent.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtGuard } from 'src/libs/service/guard/jwt.guard';
import { AddEventImageDto } from './dto/addEventImage.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('addEvent')
  addEvent(@Body() addEventDto: AddEventDto) {
    return this.eventService.addEvent(addEventDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('listOfEvents')
  listOfUsers() {
    return this.eventService.listOfEvents();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('editEvent/:id')
  async editEvent(@Param('id') id: number, @Body() editEventDto: EditEventDto) {
    return this.eventService.editEvent(id, editEventDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('viewEvent/:id')
  async viewEvent(@Param('id') id: number) {
    return this.eventService.viewEvent(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete('deleteEvent/:id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventService.deleteEvent(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('addEventImage')
  addEventImage(@Body() dto: AddEventImageDto) {
    return this.eventService.addEventImage(dto);
  }
}
