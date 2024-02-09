import { Module } from 'rilata/src/app/module/module';
import { Injectable } from '@nestjs/common';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService } from 'rilata/src/app/service/types';
import { ModelResolver } from './resolver';
import { GettingWorkshopModelsService } from './services/get-workshop-models/service';

@Injectable()
export class ModelModule extends Module {
  constructor(
    modelResolver: ModelResolver,
  ) {
    super();
    this.init(modelResolver);
  }

  moduleType: ModuleType = 'read-module';

  moduleName: string = 'model-read';

  queryServices: GeneraQueryService[] = [
    new GettingWorkshopModelsService(),
  ];

  commandServices: GeneralCommandService[] = [];
}
