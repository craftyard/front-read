/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { UuidType } from 'rilata/src/common/types';
import { GetUsersActionDod } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { Mock, spyOn } from 'bun:test';
import { UserDoesNotExistError } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { Result } from 'rilata/src/common/result/types';
import { CurrentUser } from 'cy-domain/src/subject/domain-data/user/get-current-user/s-params';

export namespace SubjectServiceFixtures {
  export class UserRepoMock implements UserCmdRepository, UserReadRepository {
    getCurrentUser(userId: string): Promise<CurrentUser> {
      throw new Error('Method not implemented.');
    }
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
}
