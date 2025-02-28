import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtGuard } from 'src/libs/service/guard/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddServiceDto } from './dto/addService.dto';
import { EditServiceDto } from './dto/editService.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('addService')
  addService(@Body() addServiceDto: AddServiceDto) {
    return this.serviceService.addService(addServiceDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('listOfServices')
  listOfServices() {
    return this.serviceService.listOfServices();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('editService/:id')
  async editService(
    @Param('id') id: number,
    @Body() editServiceDto: EditServiceDto,
  ) {
    return this.serviceService.editService(id, editServiceDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('viewService/:id')
  async viewService(@Param('id') id: number) {
    return this.serviceService.viewService(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Delete('deleteService/:id')
  async deleteService(@Param('id') id: number) {
    return this.serviceService.deleteService(id);
  }
}
