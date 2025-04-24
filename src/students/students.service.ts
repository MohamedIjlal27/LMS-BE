import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {

    const existingUser = await this.userModel.findOne({ email: createStudentDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }


    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);


    const user = await this.userModel.create({
      email: createStudentDto.email,
      password: hashedPassword,
      firstName: createStudentDto.name.split(' ')[0],
      lastName: createStudentDto.name.split(' ').slice(1).join(' '),
      role: 'student'
    });

    const createdStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
      userId: user._id 
    });

    return createdStudent.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentModel.findOne({ email }).exec();
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: Partial<CreateStudentDto>): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    if (updateStudentDto.password) {
      const hashedPassword = await bcrypt.hash(updateStudentDto.password, 10);
      updateStudentDto.password = hashedPassword;
 
      await this.userModel.findOneAndUpdate(
        { email: student.email },
        { password: hashedPassword }
      );
    }

    if (updateStudentDto.email) {
      await this.userModel.findOneAndUpdate(
        { email: student.email },
        { email: updateStudentDto.email }
      );
    }

    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async remove(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }


    await this.userModel.findOneAndDelete({ email: student.email });

   
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return deletedStudent;
  }
} 