/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { UuidType } from 'rilata/src/common/types';
import { StorePayload, ThreadStore } from 'rilata/src/app/async-store/types';
import { AnonymousUser, DomainUser } from 'rilata/src/app/caller';
import { GetUsersActionDod } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { TestResolverMock } from 'rilata/tests/fixtures/test-resolver-mock';
import { Mock, spyOn } from 'bun:test';
import { UserDoesNotExistError } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { Result } from 'rilata/src/common/result/types';

export namespace SubjectServiceFixtures {
  export class UserRepoMock implements UserCmdRepository, UserReadRepository {
    findByTelegramId(telegramId: number): Promise<UserAR[]> {
      throw new Error('Method not implemented.');
    }

    getUsers(userIds: string[]): Promise<UserAttrs[]> {
      throw new Error('Method not implemented.');
    }

    getUser(userId: string): Promise<Result<UserDoesNotExistError, UserAttrs>> {
      throw new Error('Method not implemented.');
    }
  }

  export const resolver: ModuleResolver = new TestResolverMock();

  export const resolverGetRepoMock = spyOn(
    resolver,
    'getRepository',
  ).mockReturnValue(new UserRepoMock()) as Mock<(...args: unknown[]) => UserRepoMock>;

  const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';

  export const validActionDod: GetUsersActionDod = {
    meta: {
      name: 'getUsers',
      actionId,
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

  const domainUserStorePayload: StorePayload = {
    caller: domainUser,
    moduleResolver: resolver,
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
    moduleResolver: resolver,
    actionId,
  };

  export const anonymousUserThreadStore: ThreadStore<StorePayload> = {
    run: () => {
      throw new Error('Method not implemented.');
    },
    getStore: () => anonymousUserStorePayload,
  };
}
