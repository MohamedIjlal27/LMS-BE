import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoggerService } from './common/services/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, CommonModule],
      useFactory: (configService: ConfigService, loggerService: LoggerService) => {
        const uri = configService.get('MONGODB_URI')! || 'mongodb://localhost:27017/learning_platform';
        loggerService.logConnection(uri);
        
        return {
          uri,
          connectionFactory: (connection) => {
            connection.plugin(require('mongoose-autopopulate'));
            
            // Log connection events
            connection.on('connected', () => {
              loggerService.logConnection(uri);
            });
            
            connection.on('disconnected', () => {
              loggerService.logDisconnection();
            });
            
            connection.on('error', (error) => {
              loggerService.logError(error);
            });
            
            return connection;
          },
        };
      },
      inject: [ConfigService, LoggerService],
    }),
    UsersModule,
    CoursesModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
