/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConsoleLogger } from 'rilata2/src/common/logger/console-logger';
import { ModuleResolver } from 'rilata2/src/conf/module-resolver';
import { Logger } from 'rilata2/src/common/logger/logger';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';
import { UserAttrs } from 'workshop-domain/src/subject/domain-data/user/params';

export namespace SubjectUseCaseFixtures {
  export class UserRepoMock implements UserRepository {
    getUsers(userIds: string[]): Promise<UserAttrs[]> {
      throw new Error('Method not implemented.');
    }

    findByTelegramId(telegramId: number): Promise<UserAttrs[]> {
      throw new Error('Method not implemented.');
    }
  }

  export class ResolverMock implements ModuleResolver {
    private repoMock = new UserRepoMock();

    getLogger(): Logger {
      return new ConsoleLogger();
    }

    getRepository(repoKey: unknown): UserRepository {
      return this.repoMock;
    }

    getRealisation(...args: unknown[]): unknown {
      throw new Error('Method not implemented.');
    }
  }
}
