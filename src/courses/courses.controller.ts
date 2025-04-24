import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiBody({ type: CreateCourseDto })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Returns all courses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiResponse({ status: 200, description: 'Returns the course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course successfully updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: CreateCourseDto })
  update(@Param('id') id: string, @Body() updateCourseDto: Partial<CreateCourseDto>) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course successfully deleted' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
} 