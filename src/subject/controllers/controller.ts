import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';
import { WorkshopResolver } from 'cy-domain/src/workshop/resolver';
import { SUBJECT_MODULE_URL } from 'cy-domain/src/subject/subject-config';
import { WORKSHOP_MODULE_URL } from 'cy-domain/src/workshop/workshop-config';

@Controller(SUBJECT_MODULE_URL)
export class SubjectController extends ParentController {
  // eslint-disable-next-line no-useless-constructor
  constructor(subjectResolver: SubjectResolver) {
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

@Controller(WORKSHOP_MODULE_URL)
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