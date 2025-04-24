import { IsString, IsMongoId, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum EnrollmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress'
}

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Student ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  studentId: string;

  @ApiProperty({
    description: 'Course ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439012'
  })
  @IsMongoId()
  courseId: string;

  @ApiProperty({
    description: 'Enrollment status',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.PENDING,
    required: false
  })
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus = EnrollmentStatus.PENDING;

  @ApiProperty({
    description: 'Payment status',
    example: false,
    default: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean = false;
} 