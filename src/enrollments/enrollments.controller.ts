import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.enrollmentsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkEnrollment(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string,
  ) {
    return this.enrollmentsService.checkEnrollment(courseId, studentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEnrollment(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserEnrollments(@Param('userId') userId: string) {
    return this.enrollmentsService.findByStudent(userId);
  }

  @Get('user/:userId/stats')
  @UseGuards(JwtAuthGuard)
  async getUserStats(@Param('userId') userId: string) {
    return this.enrollmentsService.getUserStats(userId);
  }

  @Post(':id/payment')
  @UseGuards(JwtAuthGuard)
  async processPayment(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.enrollmentsService.processPayment(id, processPaymentDto);
  }
} 