import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  instructor: User;
}

export const CourseSchema = SchemaFactory.createForClass(Course); 