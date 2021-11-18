import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { SchemaUtil } from '../util/schema.util';
import { Image } from './image.schema';
import { User } from './user.schema';

export type AnnouncementDocument = Announcement & Document;

@Schema(SchemaUtil.options)
export class Announcement {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop()
  category: string;

  @Prop()
  localization: string;

  @Prop()
  usage_time: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Image' }] })
  images: string[] | Image[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: string | User;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

export const AnnouncementPopulate = [
  {
    path: 'owner',
    select: { password: 0, created_at: 0, updated_at: 0 },
  },
  {
    path: 'images',
    select: { _id: 0, created_at: 0, updated_at: 0, buffer: 0 },
  },
];
