import { Injectable } from '@nestjs/common';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';
import { GettingUserService } from './services/get-users/service';
import { UserAuthentificationService } from './services/user-authentication/service';

@Injectable()
export class SubjectReadModule extends Module {
  constructor(
    subjectResolver: SubjectResolver,
  ) {
    super();
    this.init(subjectResolver);
  }

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'subject';

  queryServices: GeneraQueryService[] = [
    new GettingUserService(),
    new UserAuthentificationService(),
  ];

  commandServices: GeneralCommandService[] = [];
}
