import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  level: string;

  @IsNumber()
  price: number;

  @IsString()
  instructor: string;

  @IsString()
  duration: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;
} 