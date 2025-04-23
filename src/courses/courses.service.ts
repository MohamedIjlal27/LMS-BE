import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).exec();
  }

  async update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Course | null> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
} 