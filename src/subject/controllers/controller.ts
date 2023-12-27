import {
  Body, Controller, Post, Req, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestCY } from 'backend-core/src/app/jwt/types';
import { SubjectModule } from 'subject/module';
import { ActionDod } from 'rilata/src/domain/domain-object-data/common-types';
import { Controller as ParentController } from 'rilata/src/app/controller/controller';

const SUBJECT_MODULE_ENDPOINT = 'subject/';

@Controller(SUBJECT_MODULE_ENDPOINT)
export class SubjectController extends ParentController {
  @Post()
  async execute(
    @Body() body: ActionDod,
    @Res({ passthrough: true }) response: Response,
    @Req() req: RequestCY,
      module: SubjectModule,
  ): Promise<void> {
    return this.executeUseCase(body, req.user, module, response);
  }
}
