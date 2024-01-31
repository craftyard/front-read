import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from 'rilata/src/common/logger/logger';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';
import arrayUsers from 'cy-domain/src/subject/domain-data/user/users.json';
import arrayWorkshops from 'cy-domain/src/workshop/domain-data/workshop/workshops.json';
import { UserJsonRepository } from 'cy-domain/src/subject/domain-object/user/json-impl/repo';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { RunMode } from 'rilata/src/app/types';
import { SubjectReadModule } from './module';
import { SubjectController } from './controllers/controller';
import { WorkshopJsonRepository } from 'cy-domain/src/workshop/domain-object/workshop/json-impl/repo';
import { WorkshopResolver } from 'cy-domain/src/workshop/resolver';
import { WorkshopReadModule } from '../subject/module';
import { WorkshopController } from '../subject/controllers/controller';

@Module({})
export class SubjectReadNestModule {
  static forRoot(
    logger: Logger,
    jwtManager: JSONWebTokenLibJWTManager,
    runMode: RunMode,
  ): DynamicModule {
    const jsonUsers = JSON.stringify(arrayUsers);
    const userRepo = new UserJsonRepository(jsonUsers, logger);
    const subjectResolver = new SubjectResolver(jwtManager, userRepo, logger, runMode);
    return {
      module: SubjectReadNestModule,
      providers: [
        SubjectReadModule,
        {
          provide: SubjectResolver,
          useValue: subjectResolver,
        },
      ],
      controllers: [SubjectController],
    };
  }
}
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
