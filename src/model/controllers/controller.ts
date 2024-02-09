import {
  Controller, Post, Body, Res, Req,
} from '@nestjs/common';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { moduleUrls } from 'cy-domain/src/server-config';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { Response } from 'express';
import { ModelResolver } from '../resolver';

@Controller(moduleUrls.model)
export class ModelController extends ParentController {
  // eslint-disable-next-line no-useless-constructor
  constructor(modelResolver: ModelResolver) {
    super(modelResolver);
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
