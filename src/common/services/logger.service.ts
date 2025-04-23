import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('MongoDB');

  logQuery(query: any) {
    this.logger.debug(`MongoDB Query: ${JSON.stringify(query)}`);
  }

  logError(error: any) {
    this.logger.error(`MongoDB Error: ${error.message}`, error.stack);
  }

  logConnection(uri: string) {
    this.logger.log(`Connecting to MongoDB: ${uri}`);
  }

  logDisconnection() {
    this.logger.warn('Disconnected from MongoDB');
  }
} 