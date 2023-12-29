import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from 'rilata/src/common/logger/logger';
import { SubjectResolver } from 'cy-domain/src/subject/resolver';
import user from 'cy-domain/src/subject/domain-data/user/users.json';
import { UserJsonRepository } from 'cy-domain/src/subject/domain-object/user/json-impl/repo';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { RunMode } from 'rilata/src/app/types';
import { SubjectReadModule } from './module';
import { SubjectController } from './controllers/controller';

@Module({})
export class SubjectReadNestModule {
  static forRoot(
    logger: Logger,
    jwtManager: JSONWebTokenLibJWTManager,
    runMode: RunMode,
  ): DynamicModule {
    const userRepo = new UserJsonRepository(user as unknown as string, logger);

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
