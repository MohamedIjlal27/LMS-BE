import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Web Development'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn the basics of web development including HTML, CSS, and JavaScript'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Course instructor name',
    example: 'John Smith'
  })
  @IsString()
  instructor: string;

  @ApiProperty({
    description: 'Course duration in hours',
    example: 20,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Course price',
    example: 99.99,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Course category',
    example: 'Web Development',
    required: false
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Course image URL',
    example: 'https://example.com/course-image.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
} 