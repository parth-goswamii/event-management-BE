import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  HasMany,
  Model,
  Sequelize,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Event } from './event.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @AllowNull(false)
  @Unique
  @MaxLength(50)
  @Column
  email: string;

  @AllowNull(true)
  @MaxLength(250)
  @Column
  password: string;

  @AllowNull(true)
  @MaxLength(50)
  @Column
  name: string;

  @AllowNull(true)
  @MaxLength(15)
  @Column
  phone_number: string;

  @HasMany(() => Event)
  event: Event;

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
