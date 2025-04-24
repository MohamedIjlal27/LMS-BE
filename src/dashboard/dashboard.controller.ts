import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('recent-students')
  getRecentStudents() {
    return this.dashboardService.getRecentStudents();
  }

  @Get('popular-courses')
  getPopularCourses() {
    return this.dashboardService.getPopularCourses();
  }

  @Get('recent-enrollments')
  getRecentEnrollments() {
    return this.dashboardService.getRecentEnrollments();
  }

  @Get('system-status')
  getSystemStatus() {
    return this.dashboardService.getSystemStatus();
  }
} 