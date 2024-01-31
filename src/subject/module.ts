import { Injectable } from '@nestjs/common';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GettingUserService } from './services/user/get-users/service';
import { UserAuthentificationService } from './services/user/user-authentication/service';
import { FindWorkshopByUserIdService } from './services/workshop/find-workshop-by-user-id/service';
import { SubjectWorkshopReadResolver } from './resolver';

@Injectable()
export class SubjectReadModule extends Module {
  constructor(
    subjectWorkshopReadResolver: SubjectWorkshopReadResolver,
  ) {
    super();
    this.init(subjectWorkshopReadResolver);
  }

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'subject-worshop-read';

  queryServices: GeneraQueryService[] = [
    new GettingUserService(),
    new UserAuthentificationService(),
    new FindWorkshopByUserIdService() as unknown as GeneraQueryService,
  ];

  commandServices: GeneralCommandService[] = [];
}
