import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  courseId: string;

  @IsString()
  @IsOptional()
  status?: 'pending' | 'active' | 'completed' | 'in-progress';

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
} 