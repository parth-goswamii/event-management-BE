import { MaxLength } from 'class-validator';
import {
  AllowNull,
  Column,
  Default,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'otp' })
export class Otp extends Model<Otp> {
  @AllowNull(true)
  @Column
  @MaxLength(6)
  otp: number;

  @AllowNull(false)
  @Column
  @MaxLength(50)
  email: string;

  @AllowNull(false)
  @Column
  expire_time: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  declare createdAt: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    ),
  })
  declare updatedAt: Date;
}
