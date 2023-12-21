/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn,
} from 'bun:test';
import { ConsoleLogger } from 'rilata2/src/common/logger/console-logger';
import { GetUsersInputOptions, GetingUsersOut } from 'workshop-domain/src/subject/domain-data/user/get-users/uc-params';
import { UserAttrs } from 'workshop-domain/src/subject/domain-data/user/params';
import { ModuleResolver } from 'rilata2/src/conf/module-resolver';
import { Logger } from 'rilata2/src/common/logger/logger';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';
import { GettingUserUC } from './use-case';

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

describe('тесты для use-case getUsers', () => {
  const sut = new GettingUserUC();
  const resolver = new ResolverMock();
  sut.init(resolver);

  const validInputOptions: GetUsersInputOptions = {
    actionDod: {
      actionName: 'getUsers',
      body: {
        userIds: [
          'fa91a299-105b-4fb0-a056-92634249130c',
          '493f5cbc-f572-4469-9cf1-3702802e6a31',
        ],
      },
    },
    caller: {
      type: 'DomainUser',
      userId: 'd98f438a-c697-4da1-8245-fe993cf820c4',
      requestID: 'd98f438a-c697-4da1-8245-fe993cf820c4',
    },
  };

  const users: UserAttrs[] = [
    {
      userId: 'fa91a299-105b-4fb0-a056-92634249130c',
      telegramId: 5436134100,
      type: 'employee',
      userProfile: {
        firstName: 'Jack',
        lastName: 'Smith',
      },
    },
    {
      userId: '493f5cbc-f572-4469-9cf1-3702802e6a31',
      telegramId: 3290593910,
      type: 'employee',
      userProfile: {
        firstName: 'Bill',
        lastName: 'Oruell',
      },
    },
  ];

  test('успех, запрос для пользователя нормально проходит', async () => {
    const getUsersMock = spyOn(
      resolver.getRepository('repoKey'),
      'getUsers',
    ).mockResolvedValueOnce([...users]);

    const result = await sut.execute(validInputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetingUsersOut).toEqual(users);
    expect(getUsersMock).toHaveBeenCalledTimes(1);
    expect(getUsersMock.mock.calls[0][0]).toEqual([
      'fa91a299-105b-4fb0-a056-92634249130c',
      '493f5cbc-f572-4469-9cf1-3702802e6a31',
    ]);
  });

  test('провал, не прошла валидация', async () => {
    const notValidInputOpt = {
      ...validInputOptions,
      actionDod: {
        actionName: 'getUsers' as const,
        body: {
          userIds: [
            'fa91a299-105b-4fb0-a056-92634249l30c',
            '493f5cbc-f572-4469-9cf1-3702802e6a31',
          ],
        },
      },
    };
    const result = await sut.execute(notValidInputOpt);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'validation-error',
      domainType: 'error',
      errorType: 'app-error',
      errors: {
        getUsers: {
          0: {
            userIds: [
              {
                text: 'Значение должно соответствовать формату UUID',
                hint: {},
                name: 'UUIDFormatValidationRule',
              },
            ],
          },
        },
      },
    });
  });

  test('провал, запрещен доступ неавторизованному пользователю', async () => {
    const notValidInputOpt = {
      ...validInputOptions,
      caller: {
        type: 'AnonymousUser' as const,
        requestID: 'd98f438a-c697-4da1-8245-fe993cf820c4',
      },
    };
    const result = await sut.execute(notValidInputOpt);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Permission denied',
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['DomainUser'],
        },
      },
      errorType: 'domain-error',
      domainType: 'error',
    });
  });
});
