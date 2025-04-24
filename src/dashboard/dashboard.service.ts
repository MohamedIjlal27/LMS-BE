import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
  ) {}

  async getStats() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);


    const [totalStudents, totalCourses, totalEnrollments] = await Promise.all([
      this.studentModel.countDocuments(),
      this.courseModel.countDocuments(),
      this.enrollmentModel.countDocuments(),
    ]);

    const [lastMonthStudents, lastMonthCourses, lastMonthEnrollments] = await Promise.all([
      this.studentModel.countDocuments({ createdAt: { $lt: lastMonth } }),
      this.courseModel.countDocuments({ createdAt: { $lt: lastMonth } }),
      this.enrollmentModel.countDocuments({ createdAt: { $lt: lastMonth } }),
    ]);


    const enrollments = await this.enrollmentModel.find().populate('course');
    const revenue = enrollments.reduce((total, enrollment) => total + (enrollment.course?.price || 0), 0);
    
    const lastMonthEnrollmentRevenue = enrollments
      .filter(e => new Date(e.createdAt) < lastMonth)
      .reduce((total, enrollment) => total + (enrollment.course?.price || 0), 0);


    const studentGrowth = lastMonthStudents === 0 ? 100 : ((totalStudents - lastMonthStudents) / lastMonthStudents) * 100;
    const courseGrowth = lastMonthCourses === 0 ? 100 : ((totalCourses - lastMonthCourses) / lastMonthCourses) * 100;
    const enrollmentGrowth = lastMonthEnrollments === 0 ? 100 : ((totalEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100;
    const revenueGrowth = lastMonthEnrollmentRevenue === 0 ? 100 : ((revenue - lastMonthEnrollmentRevenue) / lastMonthEnrollmentRevenue) * 100;

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      revenue,
      studentGrowth,
      courseGrowth,
      enrollmentGrowth,
      revenueGrowth,
    };
  }

  async getRecentStudents() {
    return this.studentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
  }

  async getPopularCourses() {
    const courses = await this.courseModel.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: '$enrollments' }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return courses;
  }

  async getRecentEnrollments() {
    return this.enrollmentModel
      .find()
      .populate('student')
      .populate('course')
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
  }

  async getSystemStatus() {
    // Get unique students with active enrollments
    const activeUsers = await this.enrollmentModel.distinct('student').then(students => students.length);
    const totalEnrollments = await this.enrollmentModel.countDocuments();

    // Calculate system load based on enrollments
    const systemLoad = Math.min(Math.round((totalEnrollments / 100) * 30), 100);

    return {
      serverStatus: 'Operational',
      activeUsers,
      systemLoad,
      lastUpdated: new Date().toISOString()
    };
  }
} 