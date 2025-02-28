import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Messages } from 'src/libs/utils/constants/message';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utils/constants/response';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from './dto/registration.dto';
import { ForgotPasswordDto, VerifyEmailDto } from './dto/forgotPassword.dto';
import moment = require('moment');
import { CreateOtp, FilesUploadRO } from 'src/libs/service/interface';
import { sendEmail } from 'src/libs/service/email';
import { Otp } from 'src/model/otp.model';
import { ResetPasswordDto } from './dto/changePassword.dto';
import { FileUploadDto } from './dto/fileUpload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private jwt: JwtService,
  ) {}

  async register(dto: RegistrationDto) {
    const { email, password, name, phone_number } = dto;

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      Logger.error(`User ${Messages.ALREADY_EXIST}`);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `User ${Messages.ALREADY_EXIST}`,
      );
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const newUserData = {
      email: email,
      password: hashedPassword,
      name: name,
      phone_number: phone_number,
    };

    const newUser = await this.userModel.create(newUserData as User);

    Logger.log(`User ${Messages.ADD_SUCCESS}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      Messages.ADD_SUCCESS,
      `User ${Messages.ADD_SUCCESS}`,
    );
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const findUser = await this.userModel.findOne({
      where: { email: email },
    });

    if (!findUser) {
      Logger.error(Messages.EMAIL_INCORRECT);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.EMAIL_INCORRECT,
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      findUser?.dataValues?.password,
    );

    if (!passwordMatch) {
      Logger.error(Messages.CREDENTIAL_NOT_MATCH);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.CREDENTIAL_NOT_MATCH,
      );
    }

    const token = await this.jwt.signAsync({
      id: findUser?.id,
      email: findUser?.dataValues?.email,
    });

    Logger.log(Messages.LOGIN_SUCCESS);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      Messages.LOGIN_SUCCESS,
      { token },
    );
  }

  async listOfUsers() {
    try {
      const users = await this.userModel.findAll({
        attributes: ['id', 'name', 'email'],
      });

      if (!users || users.length === 0) {
        Logger.error(`Users ${Messages.NOT_FOUND}`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          `Users ${Messages.NOT_FOUND}`,
        );
      }

      Logger.log(`Users ${Messages.GET_SUCCESS}`);
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `Users ${Messages.GET_SUCCESS}`,
        { users },
      );
    } catch (error) {
      Logger.error(`User ${Messages.NOT_FOUND}`, error.stack);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }
  }

  x;
  async verifyEmail(dto: VerifyEmailDto) {
    const { email } = dto;

    const generateOtp = Math.floor(100000 + Math.random() * 900000);

    const findEmail = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!findEmail) {
      Logger.error(Messages.EMAIL_INCORRECT);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.EMAIL_INCORRECT,
      );
    }

    const expireDate = moment().add(5, 'minute').toDate();

    const otpData: CreateOtp = {
      otp: generateOtp,
      email,
      expire_time: expireDate,
    };

    sendEmail({ email, generateOtp });

    await this.otpModel.create(otpData as Otp);

    Logger.log(`Your OTP is ${Messages.SEND_SUCCESS}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Your OTP is ${Messages.SEND_SUCCESS}`,
    );
  }

  async forgetPassword(dto: ForgotPasswordDto) {
    const { email, otp, newPassword } = dto;

    const findOtp = await this.otpModel.findOne({ where: { otp } });

    if (!findOtp) {
      Logger.error(Messages.OTP_NOT_MATCH);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.OTP_NOT_MATCH,
      );
    }

    const findEmail = await this.userModel.findOne({
      where: { email },
    });

    if (!findEmail) {
      Logger.error(Messages.EMAIL_INCORRECT);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.EMAIL_INCORRECT,
      );
    }

    const destroyOtp = await this.otpModel.destroy({
      where: { otp },
    });

    if (destroyOtp <= 0) {
      Logger.error(`OTP ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `OTP ${Messages.NOT_FOUND}`,
      );
    }

    const currentTime = moment().format('x');
    const otpValidTime = moment(findOtp.expire_time).format('x');

    if (otpValidTime < currentTime) {
      Logger.error(Messages.OTP_EXPIRED);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        Messages.OTP_EXPIRED,
      );
    }

    const saltRounds: number = 10;
    const bcryptPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatePassword: number[] = await this.userModel.update(
      { password: bcryptPassword },
      {
        where: { email },
      },
    );

    if (updatePassword.length <= 0) {
      Logger.error(Messages.UPDATE_FAILED);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.UPDATE_FAILED,
      );
    }

    Logger.log(`Your password is ${Messages.UPDATE_SUCCESS}`);
    return HandleResponse(
      HttpStatus.ACCEPTED,
      ResponseData.SUCCESS,
      `Your password is ${Messages.UPDATE_SUCCESS}`,
    );
  }

  async resetPassword(req: any, dto: ResetPasswordDto) {
    const id = req.user.id;
    const existingUser = await this.userModel.findOne({
      where: { id },
    });

    if (existingUser && Object.keys(existingUser).length > 0) {
      const validPassword: any = await bcrypt.compare(
        dto.currentPassword,
        existingUser.dataValues.password,
      );

      if (validPassword) {
        if (dto.currentPassword === dto.newPassword) {
          Logger.error(Messages.PASSWORD_NOT_MATCH);
          return HandleResponse(
            HttpStatus.BAD_REQUEST,
            ResponseData.ERROR,
            Messages.PASSWORD_NOT_MATCH,
          );
        }

        const saltRounds = 10;
        const bcryptPassword: any = await bcrypt.hash(
          dto.newPassword,
          saltRounds,
        );

        const [updatedPassword] = await this.userModel.update(
          { password: bcryptPassword },
          {
            where: { id: existingUser.id },
          },
        );

        if (updatedPassword === 1) {
          Logger.log(`Your password is ${Messages.UPDATE_SUCCESS}`);
          return HandleResponse(
            HttpStatus.ACCEPTED,
            ResponseData.SUCCESS,
            `Your password is ${Messages.UPDATE_SUCCESS}`,
          );
        } else {
          Logger.error(Messages.UPDATE_FAILED);
          return HandleResponse(
            HttpStatus.BAD_REQUEST,
            ResponseData.ERROR,
            Messages.UPDATE_FAILED,
          );
        }
      } else {
        Logger.error(Messages.INCORRECT_PASSWORD);
        return HandleResponse(
          HttpStatus.BAD_REQUEST,
          ResponseData.ERROR,
          Messages.INCORRECT_PASSWORD,
        );
      }
    } else {
      Logger.error(Messages.ID_NOT_FOUND);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        Messages.ID_NOT_FOUND,
      );
    }
  }

  async fileUpload(req: any, file: Express.Multer.File, dto: FileUploadDto) {
    if (!file) {
      Logger.error(`Image ${Messages.IS_REQUIRED}`);
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `Image ${Messages.IS_REQUIRED}`,
      );
    }

    const image: FilesUploadRO = {
      file: file.filename,
    };

    Logger.log(`Image ${Messages.ADD_SUCCESS}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      `Image ${Messages.ADD_SUCCESS}`,
      image,
    );
  }
}
