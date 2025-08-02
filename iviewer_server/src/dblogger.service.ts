// image.service.ts 또는 별도 서비스
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DBConnectionLoggerService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      Logger.log('✅ Database connected successfully!', 'DB');
    } catch (error) {
      Logger.error('❌ Database connection failed!', error, 'DB');
    }
  }
}
