import { Injectable } from '@nestjs/common';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { GettingUserService } from './services/get-users/service';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { Service } from 'rilata/src/app/service/service';
import { Logger } from 'rilata/src/common/logger/logger';

@Injectable()
export class SubjectModule implements Module {
  moduleType: ModuleType;
  moduleName: string;
  queryServices: GeneraQueryService[];
  commandServices: GeneralCommandService[];
  protected moduleResolver: ModuleResolver;
  protected services: Service[];
  protected logger: Logger;
  init(moduleResolver: ModuleResolver): void {
      throw new Error('Method not implemented.');
  }
  getServiceByName(name: string): Service {
      throw new Error('Method not implemented.');
  }
  getLogger(): Logger {
      throw new Error('Method not implemented.');
  }
  getModuleName(): string {
      throw new Error('Method not implemented.');
  }
  queryUseCases: GeneraQueryService[] = [
    new GettingUserService(),
  ];

  commandUseCases: GeneralCommandService[] = [];
}
