import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  instructor: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  imageUrl: string;

  @Prop({ default: 0 })
  students: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course); 