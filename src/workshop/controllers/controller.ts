import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { WorkshopResolver } from 'cy-domain/src/workshop/resolver';

const WORKSHOP_MODULE_ENDPOINT = 'workshop/';

  @Controller(WORKSHOP_MODULE_ENDPOINT)
export class WorkshopController extends ParentController {
  // eslint-disable-next-line no-useless-constructor
  constructor(workshopResolver: WorkshopResolver) {
    super(workshopResolver);
  }

  @Post()
  async execute(
      @Body() body: ActionDod,
      @Res({ passthrough: true }) response: Response,
      @Req() req: RequestCY,
  ): Promise<void> {
    return this.executeService(body, req.user, response);
  }
}
