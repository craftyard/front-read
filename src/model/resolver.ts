import { Database } from 'rilata/src/app/database/database';
import { Module } from 'rilata/src/app/module/module';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { JWTPayload } from 'cy-domain/src/subject/domain-data/user/user-authentification/a-params';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';

export class ModelReadResolver implements ModuleResolver {
  private module!: Module;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    protected tokenManager: TokenCreator<JWTPayload> & TokenVerifier<JWTPayload>,
    protected modelReadRepo: ModelReadRepository,
    protected logger: Logger,
    protected runMode: RunMode,
  // eslint-disable-next-line no-empty-function
  ) {}

  init(module: Module): void {
    this.module = module;
  }

  getRunMode(): RunMode {
    return this.runMode;
  }

  getModule(): Module {
    return this.module;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getRepository(key: unknown): unknown {
    if (key === ModelReadRepository) return this.modelReadRepo;
    throw this.logger.error(`not finded key for getRepository method of ModelResolver, key: ${key}`);
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getRealisation(key: unknown): unknown {
    if (key === TokenCreator || key === TokenVerifier) return this.tokenManager;
    throw this.logger.error(`not finded key for getRealisation method of ModelResolver, key: ${key}`);
  }
}
