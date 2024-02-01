import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from 'rilata/src/common/logger/logger';
import arrayUsers from 'cy-domain/src/subject/domain-data/user/users.json';
import arrayWorkshops from 'cy-domain/src/workshop/domain-data/workshop/workshops.json';
import { UserJsonRepository } from 'cy-domain/src/subject/domain-object/user/json-impl/repo';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { RunMode } from 'rilata/src/app/types';
import { SubjectReadModule } from './module';
import { WorkshopJsonRepository } from 'cy-domain/src/workshop/domain-object/workshop/json-impl/repo';
import { SubjectWorkshopReadResolver } from './resolver';
import { SubjectWorkshopReadController } from './controllers/controller';

@Module({})
export class SubjectWorkshopReadNestModule {
  static forRoot(
    logger: Logger,
    jwtManager: JSONWebTokenLibJWTManager,
    runMode: RunMode,
  ): DynamicModule {
    const jsonUsers = JSON.stringify(arrayUsers);
    const userRepo = new UserJsonRepository(jsonUsers, logger);
    const jsonWorkshops = JSON.stringify(arrayWorkshops);
    const workshopReadRepo = new WorkshopJsonRepository(jsonWorkshops, logger);
    const subjectWorkshopReadResolver = new SubjectWorkshopReadResolver(jwtManager, userRepo, workshopReadRepo, logger, runMode);
    return {
      module: SubjectWorkshopReadNestModule,
      providers: [
        SubjectReadModule,
        {
          provide: SubjectWorkshopReadResolver,
          useValue: subjectWorkshopReadResolver,
        },
      ],
      controllers: [SubjectWorkshopReadController],
    };
  }
}
