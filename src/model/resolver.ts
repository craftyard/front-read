import { Database } from 'rilata/src/app/database/database';
import { Module } from 'rilata/src/app/module/module';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { RunMode } from 'rilata/src/app/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { ModelReadRepository } from 'cy-domain/src/model/domain-object/model/read-repository';
import { AssertionException } from 'rilata/src/common/exeptions';

export class ModelResolver implements ModuleResolver {
  private module!: Module;

  // eslint-disable-next-line no-useless-constructor
  constructor(
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
    const errStr = `not finded key for getRepository method of ModelResolver, key: ${key}`;
    this.logger.error(errStr);
    throw new AssertionException(errStr);
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getRealisation(): unknown {
    throw new Error('Method not implemented.');
  }
}
