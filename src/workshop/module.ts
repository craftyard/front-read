import { Injectable } from '@nestjs/common';
import { Module } from 'rilata/src/app/module/module';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { ModuleType } from 'rilata/src/app/module/types';

@Injectable()
export class WorkshopReadModule extends Module {
  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[];

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'workshop';
}
