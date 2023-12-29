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
import { UuidType } from 'rilata/src/common/types';
import { StorePayload, ThreadStore } from 'rilata/src/app/async-store/types';
import { AnonymousUser, DomainUser } from 'rilata/src/app/caller';
import { GetUsersActionDod } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';

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

  export const validActionDod: GetUsersActionDod = {
    meta: {
      name: 'getUsers',
      actionId: 'd98f438a-c697-4da1-8245-fe993cf820c4',
      domainType: 'action',
    },
    attrs: {
      userIds: [
        'fa91a299-105b-4fb0-a056-92634249130c',
        '493f5cbc-f572-4469-9cf1-3702802e6a31',
      ],
    },
  };

  const domainUser: DomainUser = {
    type: 'DomainUser',
    userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
  };

  const moduleResolver: ModuleResolver = new ResolverMock();

  const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';

  const domainUserStorePayload: StorePayload = {
    caller: domainUser,
    moduleResolver,
    actionId,
  };

  export const domainUserThreadStore: ThreadStore<StorePayload> = {
    run: () => {
      throw new Error('Method not implemented.');
    },
    getStore: () => domainUserStorePayload,
  };

  const anonymousUser:AnonymousUser = {
    type: 'AnonymousUser',
  };

  const anonymousUserStorePayload: StorePayload = {
    caller: anonymousUser,
    moduleResolver,
    actionId,
  };

  export const anonymousUserThreadStore: ThreadStore<StorePayload> = {
    run: () => {
      throw new Error('Method not implemented.');
    },
    getStore: () => anonymousUserStorePayload,
  };
}
