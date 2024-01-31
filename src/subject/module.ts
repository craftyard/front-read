import { Injectable } from '@nestjs/common';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';
import { GettingUserService } from './services/user/get-users/service';
import { UserAuthentificationService } from './services/user/user-authentication/service';
import { FindWorkshopByUserIdService } from './services/workshop/find-workshop-by-user-id/service';
import { WorkshopResolver } from 'cy-domain/src/workshop/resolver';

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

@Injectable()
export class WorkshopReadModule extends Module {
  constructor(workshopResolver: WorkshopResolver) {
    super();
    this.init(workshopResolver);
  }

  queryServices: GeneraQueryService[] = [
    new FindWorkshopByUserIdService() as unknown as GeneraQueryService,
  ];

  commandServices: GeneralCommandService[] = [];

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'workshop';
}