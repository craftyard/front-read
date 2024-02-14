import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { moduleUrls } from 'cy-domain/src/server-config';
import { SubjectWorkshopReadResolver } from '../resolver';

@Controller(moduleUrls.subjectWorkshopRead)
export class SubjectWorkshopReadController extends ParentController {
  // eslint-disable-next-line no-useless-constructor
  constructor(subjectResolver: SubjectWorkshopReadResolver) {
    super(subjectResolver);
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
