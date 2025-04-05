import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

const OPTIONS = { 
  timestamps: true,
  toJSON: {
     transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
     }
  } 
}

@Schema(OPTIONS)
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
