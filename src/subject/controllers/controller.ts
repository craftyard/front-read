import {
  Body, Controller, Inject, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'craft-yard-backend/src/app/jwt/types';
import { SubjectModule } from 'subject/module';
import { ActionDod } from 'rilata2/src/domain/domain-object-data/common-types';
import { Controller as ParentController } from 'rilata2/src/app/controller/controller';

const SUBJECT_MODULE_ENDPOINT = 'subject/';

@Controller(SUBJECT_MODULE_ENDPOINT)
export class SubjectController extends ParentController {
  @Post()
  async execute(
    @Body() body: ActionDod,
    @Res({ passthrough: true }) response: Response,
    @Req() req: RequestCY,
    @Inject() module: SubjectModule,
  ): Promise<void> {
    return this.executeUseCase(body, req.user, module, response);
  }
}
