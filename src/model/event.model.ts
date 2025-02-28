import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { EventImage } from './eventImage.model';
import { Service } from './service.model';

@Table({ tableName: 'event' })
export class Event extends Model<Event> {
  @ForeignKey(() => User)
  @AllowNull(true)
  @MaxLength(10)
  @Column
  user_id: number;

  @AllowNull(true)
  @MaxLength(50)
  @Column
  event_name: string;

  @AllowNull(true)
  @MaxLength(50)
  @Column
  event_description: string;

  @BelongsTo(() => User)
  user: User[];

  @HasMany(() => EventImage)
  eventImages: EventImage[];

  @HasMany(() => Service)
  service: Service;

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
