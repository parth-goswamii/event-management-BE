import { HttpStatus, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import { ResponseData } from '../utils/constants/response';
import { HandleResponse } from '../service/handleResponse';
dotenv.config();

const transport: any = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

export const sendEmail = async (obj: any) => {
  const { email, generateOtp } = obj;
  const mailOption = {
    to: email,
    subject: 'Email OTP verification ',
    html: `
    <p>Your OTP is <strong>${generateOtp}</strong></p>
    <p>Please do not share it with anyone.</p>
    <p>OTP will expire in 5 minutes.</p>
    `,
  };
  try {
    const mail = await transport.sendMail(mailOption);
    Logger.log('Email sent: ' + mail.response);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      'Email successfully: ' + mail.response,
    );
  } catch (error) {
    Logger.error('Failed to send email: ' + error.message);
    throw new Error('Email sending failed!!');
  }
};

module.exports = { sendEmail };
