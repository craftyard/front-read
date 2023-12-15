import { describe, test, expect } from 'bun:test';
import { GetUsersInputOptions, GetingUsersOut } from 'workshop-domain/src/subject/domain-data/user/get-users/uc-params';
import { UserAttrs } from 'workshop-domain/src/subject/domain-data/user/params';
import { GettingUserUC } from './use-case';

describe('тесты для use-case getUsers', () => {
  const sut = new GettingUserUC();
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
    const result = await sut.execute(validInputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetingUsersOut).toEqual(users);
  });
});
