import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { ActionDod } from 'rilata/src/domain/domain-data/domain-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';

const SUBJECT_MODULE_ENDPOINT = 'subject/';

@Controller(SUBJECT_MODULE_ENDPOINT)
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
