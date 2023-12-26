import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'craft-yard-backend/src/app/jwt/types';
import { ActionDod } from 'rilata2/src/domain/domain-object-data/common-types';
import { Controller as ParentController } from 'rilata2/src/app/controller/controller';
import { WorkshopModule } from 'workshop/module';

const WORKSHOP_MODULE_ENDPOINT = 'workshop/';

  @Controller(WORKSHOP_MODULE_ENDPOINT)
export class WorkshopController extends ParentController {
    @Post()
  async execute(
      @Body() body: ActionDod,
      @Res({ passthrough: true }) response: Response,
      @Req() req: RequestCY,
        module: WorkshopModule,
  ): Promise<void> {
    return this.executeUseCase(body, req.user, module, response);
  }
}
