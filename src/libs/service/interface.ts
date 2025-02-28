export interface CreateOtp {
  otp: number;
  email: string;
  expire_time: Date;
}

export interface FilesUploadRO {
  file: string;
}
