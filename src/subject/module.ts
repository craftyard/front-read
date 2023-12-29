import { Injectable } from '@nestjs/common';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GettingUserService } from './services/get-users/service';
import { UserAuthentificationService } from './services/user-authentication/service';

@Injectable()
export class SubjectModule extends Module {
  moduleType: ModuleType = 'read-module';

  moduleName: string = 'subject';

  queryServices: GeneraQueryService[] = [
    new GettingUserService(),
    new UserAuthentificationService(),
  ];

  commandServices: GeneralCommandService[] = [];
}
