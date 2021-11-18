import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { SchemaUtil } from '../util/schema.util';
import { Announcement, AnnouncementPopulate } from './announcement.schema';
import { User } from './user.schema';

export type FavoriteDocument = Favorite & Document;

@Schema(SchemaUtil.options)
export class Favorite {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: string | User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Announcement' })
  announcement: string | Announcement;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

export const FavoritePopulate = [
  {
    path: 'owner',
    select: { _id: 0, password: 0, created_at: 0, updated_at: 0 },
  },
  {
    path: 'announcement',
    select: { _id: 0, created_at: 0, updated_at: 0 },
    populate: AnnouncementPopulate,
  },
];
