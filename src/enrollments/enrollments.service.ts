import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createEnrollment(createEnrollmentDto: CreateEnrollmentDto) {
    const enrollment = new this.enrollmentModel({
      student: createEnrollmentDto.studentId,
      course: createEnrollmentDto.courseId,
      status: 'pending',
      isPaid: false,
    });
    return enrollment.save();
  }

  async processPayment(id: string, processPaymentDto: ProcessPaymentDto) {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

 
    enrollment.isPaid = true;
    enrollment.status = 'active';
    enrollment.paymentDate = new Date();
    enrollment.paymentMethod = processPaymentDto.paymentMethod;
    enrollment.transactionId = `TXN-${Date.now()}`;

    await this.courseModel.findByIdAndUpdate(
      enrollment.course,
      { $inc: { students: 1 } }
    );

    await this.userModel.findByIdAndUpdate(
      enrollment.student,
      { 
        $push: { enrolledCourses: enrollment.course },
        $inc: { totalEnrollments: 1 }
      }
    );

    return enrollment.save();
  }

  async getEnrollment(id: string) {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }

  async checkEnrollment(courseId: string, studentId: string) {
    const enrollment = await this.enrollmentModel.findOne({
      course: courseId,
      student: studentId,
      status: 'active'
    });
    return { isEnrolled: !!enrollment };
  }

  async getUserEnrollments(userId: string) {
    const enrollments = await this.enrollmentModel
      .find({ student: userId, status: 'active' })
      .populate('course')
      .exec();

    return enrollments.map(enrollment => ({
      _id: enrollment.course._id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      instructor: enrollment.course.instructor,
      image: enrollment.course.imageUrl,
      progress: enrollment.progress,
      lastAccessed: enrollment.updatedAt?.toLocaleDateString()
    }));
  }

  async getUserStats(userId: string) {
    const enrollments = await this.enrollmentModel
      .find({ student: userId, status: 'active' })
      .populate('course')
      .exec();


    const totalLearningTime = enrollments.reduce((total, enrollment) => {
      const courseDuration = parseInt(enrollment.course.duration) || 0;
      const progress = enrollment.progress || 0;
      return total + (courseDuration * progress / 100);
    }, 0);

    const hours = Math.floor(totalLearningTime / 60);
    const minutes = Math.round(totalLearningTime % 60);
    const learningTime = `${hours}h ${minutes}m`;


    const certificates = enrollments.filter(e => e.progress === 100).length;

    return {
      learningTime,
      coursesEnrolled: enrollments.length,
      certificates
    };
  }
} 