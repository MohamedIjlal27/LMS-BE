import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  student: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: Course;

  @Prop({ required: true, default: 'pending' })
  status: string;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ required: true, default: false })
  isPaid: boolean;

  @Prop()
  paymentDate?: Date;

  @Prop()
  paymentMethod?: string;

  @Prop()
  transactionId?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment); 