import { MaxLength } from 'class-validator';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { Event } from './event.model';

@Table({ tableName: 'service' })
export class Service extends Model<Service> {
  @ForeignKey(() => Event)
  @AllowNull(true)
  @MaxLength(10)
  @Column
  event_id: number;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  service_name: string;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  service_description: string;

  @AllowNull(false)
  @Column
  price: string;

  @BelongsTo(() => Event)
  event: Event[];

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
