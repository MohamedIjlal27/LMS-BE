import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: Student;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: Course;

  @Prop({ required: true, default: 'active' })
  status: string;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment); 