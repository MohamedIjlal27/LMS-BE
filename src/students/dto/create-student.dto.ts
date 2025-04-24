import { IsString, IsEmail, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe'
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Student email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Student password - minimum 8 characters',
    example: 'password123',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Student bio',
    example: 'A passionate learner interested in web development',
    required: false
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'Student account status',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Whether to send welcome email',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  sendWelcomeEmail?: boolean = true;
} 