/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { Logger } from 'rilata/src/common/logger/logger';
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { Database } from 'rilata/src/app/database/database';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';
import { Module } from 'rilata/src/app/module/module';
import { RunMode } from 'rilata/src/app/types';
import { DTO } from 'rilata/src/domain/dto';

export namespace SubjectUseCaseFixtures {
  export class UserRepoMock implements UserCmdRepository, UserReadRepository {
    findByTelegramId(telegramId: number): Promise<UserAR[]> {
      throw new Error('Method not implemented.');
    }

    getUsers(userIds: string[]): Promise<UserAttrs[]> {
      throw new Error('Method not implemented.');
    }
  }

  export class ResolverMock implements ModuleResolver {
    private repoMock = new UserRepoMock();

    init(module: Module): void {
      throw new Error('Method not implemented.');
    }

    getTokenVerifier(): TokenVerifier<DTO> {
      throw new Error('Method not implemented.');
    }

    getRunMode(): RunMode {
      throw new Error('Method not implemented.');
    }

    getModule(): Module {
      throw new Error('Method not implemented.');
    }

    getDatabase(): Database {
      throw new Error('Method not implemented.');
    }

    getLogger(): Logger {
      return new ConsoleLogger();
    }

    getRepository(repoKey: unknown): UserRepoMock {
      return this.repoMock;
    }

    getRealisation(...args: unknown[]): unknown {
      throw new Error('Method not implemented.');
    }
  }
}
