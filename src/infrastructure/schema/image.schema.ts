import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaUtil } from '../util/schema.util';

export type ImageDocument = Image & Document;

@Schema(SchemaUtil.options)
export class Image {
  @Prop()
  originalname: string;

  @Prop()
  buffer: Buffer;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
