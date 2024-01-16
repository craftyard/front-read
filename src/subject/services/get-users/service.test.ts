/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn, afterEach,
} from 'bun:test';
import { GetingUsersOut } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { GettingUserService } from './service';
import { SubjectServiceFixtures as fixtures } from '../fixtures';

describe('тесты для use-case getUsers', () => {
  const sut = new GettingUserService();
  sut.init(fixtures.resolver);
  afterEach(() => {
    fixtures.resolverGetRepoMock.mockClear();
  });

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
    const userRepo = fixtures.resolverGetRepoMock();
    const getUsersMock = spyOn(userRepo, 'getUsers').mockResolvedValueOnce([...users]);
    storeDispatcher.setThreadStore({ ...fixtures.domainUserThreadStore });
    const result = await sut.execute({ ...fixtures.validActionDod });
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetingUsersOut).toEqual(users);
    expect(getUsersMock).toHaveBeenCalledTimes(1);
    expect(getUsersMock.mock.calls[0][0]).toEqual([
      'fa91a299-105b-4fb0-a056-92634249130c',
      '493f5cbc-f572-4469-9cf1-3702802e6a31',
    ]);
  });

  test('провал, запрещен доступ неавторизованному пользователю', async () => {
    storeDispatcher.setThreadStore({ ...fixtures.anonymousUserThreadStore });
    const result = await sut.execute({ ...fixtures.validActionDod });
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Действие не доступно',
        hint: {
          allowedOnlyFor: ['DomainUser'],
        },
      },
      name: 'Permission denied',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
    expect(fixtures.resolverGetRepoMock).toHaveBeenCalledTimes(0);
  });
});
