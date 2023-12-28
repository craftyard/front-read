import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { Response } from 'express';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';

const WORKSHOP_MODULE_ENDPOINT = 'workshop/';

  @Controller(WORKSHOP_MODULE_ENDPOINT)
export class WorkshopController extends ParentController {
    @Post()
  async execute(
      @Body() body: ActionDod,
      @Res({ passthrough: true }) response: Response,
      @Req() req: RequestCY,
        moduleResolver: ModuleResolver,
  ): Promise<void> {
    return this.execute(body, response, req, moduleResolver);
  }
}
