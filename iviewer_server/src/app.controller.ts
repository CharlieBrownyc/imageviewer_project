import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Res() res: Response): void {
    return res.redirect('images');
  }

  @Get('hello0')
  getHello0(): string {
    return this.appService.getHello0();
  }
}
