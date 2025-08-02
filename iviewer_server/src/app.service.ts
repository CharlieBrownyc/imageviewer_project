import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello0(): string {
    return 'Hello World!!';
  }
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
