import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  Default,
  Sequelize,
} from 'sequelize-typescript';
import { Event } from './event.model';

@Table({ tableName: 'event_images' })
export class EventImage extends Model {
  @Column
  image_path: string;

  @ForeignKey(() => Event)
  @Column
  event_id: number;

  @BelongsTo(() => Event)
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
