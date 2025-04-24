import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

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

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const student = await this.userModel.findById(createEnrollmentDto.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.courseModel.findById(createEnrollmentDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrollment = new this.enrollmentModel({
      student: student._id,
      course: course._id,
      status: createEnrollmentDto.status || 'pending',
      isPaid: createEnrollmentDto.isPaid || false,
    });

    const savedEnrollment = await enrollment.save();
    return this.enrollmentModel
      .findById(savedEnrollment._id)
      .populate('student')
      .populate('course')
      .exec();
  }

  async findAll() {
    return this.enrollmentModel
      .find()
      .populate('student')
      .populate('course')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const enrollment = await this.enrollmentModel
      .findById(id)
      .populate('student')
      .populate('course')
      .exec();

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentModel
      .findByIdAndUpdate(id, updateEnrollmentDto, { new: true })
      .populate('student')
      .populate('course')
      .exec();

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async remove(id: string) {
    const enrollment = await this.enrollmentModel.findByIdAndDelete(id).exec();

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async findByStudent(studentId: string) {
    return this.enrollmentModel
      .find({ student: studentId })
      .populate('student')
      .populate('course')
      .sort({ createdAt: -1 })
      .exec();
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

  async getUserStats(userId: string) {
    const enrollments = await this.enrollmentModel
      .find({ student: userId })
      .populate('course')
      .exec();

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (enrollment) => enrollment.status === 'completed',
    ).length;
    const inProgressCourses = enrollments.filter(
      (enrollment) => enrollment.status === 'in-progress',
    ).length;

    const totalProgress = enrollments.reduce(
      (sum, enrollment) => sum + enrollment.progress,
      0,
    );
    const averageProgress =
      totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
    };
  }

  async checkEnrollment(courseId: string, studentId: string) {
    const enrollment = await this.enrollmentModel.findOne({
      course: courseId,
      student: studentId,
    });
    return { isEnrolled: !!enrollment };
  }
} 