import { Injectable } from '@nestjs/common';
import { Module } from 'rilata/src/app/module/module';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { ModuleType } from 'rilata/src/app/module/types';
import { FindWorkshopByUserIdService } from './services/find-workshop-by-user-id/service';

@Injectable()
export class WorkshopReadModule extends Module {
  queryServices: GeneraQueryService[] = [
    new FindWorkshopByUserIdService() as unknown as GeneraQueryService,
  ];

  commandServices: GeneralCommandService[];

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'workshop';
}
