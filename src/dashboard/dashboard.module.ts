import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student, StudentSchema } from '../students/entities/student.entity';
import { Course, CourseSchema } from '../courses/entities/course.entity';
import { Enrollment, EnrollmentSchema } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema }
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {} 