import { Module, DynamicModule } from '@nestjs/common';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { WorkshopResolver } from 'cy-domain/src/workshop/resolver';
import arrayWorkshops from 'cy-domain/src/workshop/domain-data/workshop/workshops.json';
import { WorkshopJsonRepository } from 'cy-domain/src/workshop/domain-object/workshop/json-impl/repo';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { WorkshopReadModule } from './module';
import { WorkshopController } from './controllers/controller';

@Module({})
export class WorkshopReadNestModule {
  static forRoot(
    logger: Logger,
    jwtManager: JSONWebTokenLibJWTManager,
    runMode: RunMode,
  ): DynamicModule {
    const jsonWorkshops = JSON.stringify(arrayWorkshops);
    const workshopReadRepo = new WorkshopJsonRepository(jsonWorkshops, logger);

    const workshopResolver = new WorkshopResolver(workshopReadRepo, logger, runMode, jwtManager);
    return {
      module: WorkshopReadNestModule,
      providers: [
        WorkshopReadModule,
        {
          provide: WorkshopResolver,
          useValue: workshopResolver,
        },
      ],
      controllers: [WorkshopController],
    };
  }
}
