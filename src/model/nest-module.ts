import { DynamicModule, Module } from '@nestjs/common';
import { JSONWebTokenLibJWTManager } from 'backend-core/src/infra/jwt/jsonwebtoken-lib.jwt.manager';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { ModelReadResolver } from './resolver';
import { ModelReadModule } from './module';
import { ModelReadController } from './controllers/controller';

@Module({})
export class ModelReadNestModule {
  static forRoot(
    logger: Logger,
    jwtManager: JSONWebTokenLibJWTManager,
    runMode: RunMode,
  ): DynamicModule {
    const modelReadResolver = new ModelReadResolver(
      jwtManager,
      new ModelReadRepository(),
      logger,
      runMode,
    );
    return {
      module: ModelReadNestModule,
      providers: [
        ModelReadModule,
        {
          provide: ModelReadResolver,
          useValue: modelReadResolver,
        },
      ],
      controllers: [ModelReadController],
    };
  }
}
