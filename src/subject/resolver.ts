import { Logger } from 'rilata/src/common/logger/logger';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { AssertionException } from 'rilata/src/common/exeptions';
import { Database } from 'rilata/src/app/database/database';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';
import { RunMode } from 'rilata/src/app/types';
import { Module } from 'rilata/src/app/module/module';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { JWTPayload } from 'cy-domain/src/subject/domain-data/user/user-authentification/a-params';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';

export class SubjectWorkshopReadResolver implements ModuleResolver {
  private module!: Module;

  protected botToken: string;

  constructor(
    protected tokenManager: TokenCreator<JWTPayload> & TokenVerifier<JWTPayload>,
    protected userRepo: UserReadRepository,
    protected workshopReadRepo: WorkshopReadRepository,
    protected logger: Logger,
    protected runMode: RunMode,
  ) {
    const envBotToken = process.env.BOT_TOKEN;
    if (envBotToken === undefined) {
      const errStr = 'не найден токен бота в переменном окружений по ключу BOT_TOKEN';
      this.logger.error(errStr);
      throw new AssertionException(errStr);
    }
    this.botToken = envBotToken;
  }

  getRunMode(): RunMode {
    return this.runMode;
  }

  init(module: Module): void {
    this.module = module;
  }

  getModule(): Module {
    return this.module;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFacade(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getRealisation(key: unknown): unknown {
    if (key === 'botToken') return this.botToken;
    if (key === TokenCreator || key === TokenVerifier) return this.tokenManager;
    const errStr = `not finded key for getRealisation method of SubjectResolver, key: ${key}`;
    this.logger.error(errStr);
    throw new AssertionException(errStr);
  }

  getRepository(key: unknown): unknown {
    if (key === WorkshopReadRepository) return this.workshopReadRepo;
    if (key === UserReadRepository) return this.userRepo;
    const errStr = `not finded key for getRealisation method of SubjectResolver, key: ${key}`;
    this.logger.error(errStr);
    throw new AssertionException(errStr);
  }
}
