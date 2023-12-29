/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn,
} from 'bun:test';
import { GetUsersActionDod, GetingUsersOut } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { GettingUserService } from './service';
import { SubjectUseCaseFixtures as fixtures } from '../fixtures';

describe('тесты для use-case getUsers', () => {
  const sut = new GettingUserService();
  const resolver = new fixtures.ResolverMock();
  sut.init(resolver);

  const validActionDod: GetUsersActionDod = {
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

    const result = await sut.execute(validActionDod);
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
      ...validActionDod,
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
      meta: {
        name: 'Validation error',
        domainType: 'error',
        errorType: 'app-error',
      },
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
      ...validActionDod,
      caller: {
        type: 'AnonymousUser' as const,
        requestID: 'd98f438a-c697-4da1-8245-fe993cf820c4',
      },
    };
    const result = await sut.execute(notValidInputOpt);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['DomainUser'],
        },
      },
      meta: {
        name: 'Permission denied',
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
