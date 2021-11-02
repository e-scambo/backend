import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaUtil } from '../util/schema.util';

export type UserDocument = User & Document;

@Schema(SchemaUtil.options)
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
