import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

const OPTIONS = {
  timestamps: true,
};

@Schema(OPTIONS)
export class Url {
  @Prop({ required: true })
  shortId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: 0 })
  clickCount?: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
