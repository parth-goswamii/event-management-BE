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
  Req,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto, VerifyEmailDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/changePassword.dto';
import { JwtGuard } from 'src/libs/service/guard/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/libs/helper/multer';
import { FileUploadDto } from './dto/fileUpload.dto';

@ApiTags('User Module')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: RegistrationDto) {
    return this.userService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user/listOfUsers')
  listOfUsers() {
    return this.userService.listOfUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Post('verifyEmail')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgetPassword')
  forgetPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgetPassword(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('resetPassword')
  resetPassword(@Req() req: any, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req, dto);
  }

  @ApiTags('File-upload')
  @HttpCode(HttpStatus.OK)
  @Post('fileUploads')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: storage }))
  fileUpload(
    @Req() req,
    @Body() dto: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.fileUpload(req, file, dto);
  }
}
