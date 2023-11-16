import { describe, expect, test } from 'bun:test';
import { ConsoleLogger } from 'rilata2/src/common/logger/console-logger';
import { UserAttrs, UserProfile } from 'workshop-domain/src/subject/domain-data/user/params';
import { UserJsonRepository } from './json-repo';

const testUsers: UserAttrs[] = [
  {
    userId: 'fa91a299-105b-4fb0-a056-92634249130c',
    telegramId: 5436134100,
    employeeId: 'fa505e1a-d875-41f3-adcb-1c15047fe28a',
    userProfile: {
      name: 'Jack',
    },
  },
  {
    userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
    telegramId: 3290593910,
    employeeId: 'b1c357e6-fe52-4fcd-b61c-db98af09d9cc',
    userProfile: {
      name: 'Bill',
    },
  },
  {
    userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
    telegramId: 5436134100,
    userProfile: {
      name: 'Jack',
    },
  },
];

const testUsersAsJson = JSON.stringify(testUsers);

const getUserAttrs = (attrs: Partial<UserAttrs>) => {
  const user = {
    userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
    telegramId: 5436134100,
    userProfile: {
      name: 'Jack',
    },
  };
  return JSON.stringify([{ ...user, ...attrs }]);
};

describe('UserAr json implementation repository tests', () => {
  describe('проверка инвариантов при загрузке объекта userAr', () => {
    test('провал, проверка на валидность userId и выкидывается ошибка', () => {
      try {
        const userAttrsWithUndefinedUserId = getUserAttrs({ userId: undefined });
        (() => new UserJsonRepository(userAttrsWithUndefinedUserId, new ConsoleLogger()))();
        expect(true).toBe(false);
      } catch (error) {
        expect(String(error)).toContain('Входящие данные не валидны');
      }

      // last char not valid;
      try {
        const userAttrsWithInvalidUserId = getUserAttrs(
          { userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471dU' },
        );
        (() => new UserJsonRepository(userAttrsWithInvalidUserId, new ConsoleLogger()))();
        expect(true).toBe(false);
      } catch (error) {
        expect(String(error)).toContain('Входящие данные не валидны');
      }
    });
  });

  test('провал, при загрузке если есть объект без или с неправильным telegramId, то выкинется ошибка', () => {
    try {
      const userAttrsWithUndefinedTelegramId = getUserAttrs({ telegramId: undefined });
      (() => new UserJsonRepository(userAttrsWithUndefinedTelegramId, new ConsoleLogger()))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }

    try {
      const userAttrsWithStringTelegramId = getUserAttrs(
        { telegramId: ('5436134100' as unknown as number) },
      );
      (() => new UserJsonRepository(userAttrsWithStringTelegramId, new ConsoleLogger()))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }
  });

  test('провал, при загрузке если есть объект без или с неправильным userProfile, то выкинется ошибка', () => {
    try {
      const userAttrsWithUndefinedUserProfile = getUserAttrs({ userProfile: undefined });
      (() => new UserJsonRepository(
        userAttrsWithUndefinedUserProfile,
        new ConsoleLogger(),
      ))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }

    try {
      const userAttrsWithInvalidUserProfile = getUserAttrs(
        { userProfile: ('5436134100' as unknown as UserProfile) },
      );
      (() => new UserJsonRepository(userAttrsWithInvalidUserProfile, new ConsoleLogger()))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }
  });

  test('провал, при загрузке если в userProfile не указан атрибут name или его значение не строковое, то выкинется ошибка', () => {
    try {
      const userAttrsWithoutName = getUserAttrs(
        { userProfile: { name: undefined as unknown as string } },
      );
      (() => new UserJsonRepository(userAttrsWithoutName, new ConsoleLogger()))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }

    try {
      const userAttrsWithInvalidName = getUserAttrs(
        { userProfile: { name: 5 as unknown as string } },
      );
      (() => new UserJsonRepository(userAttrsWithInvalidName, new ConsoleLogger()))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }
  });

  describe('поиск пользователя по telegramId', () => {
    const sut = new UserJsonRepository(testUsersAsJson, new ConsoleLogger());
    test('успех, когда в списке есть несколько пользователей с одинаковым telegramId, то возвращаются все', () => {
      const result = sut.findByTelegramId(5436134100);
      expect(result).toEqual([
        {
          userId: 'fa91a299-105b-4fb0-a056-92634249130c',
          telegramId: 5436134100,
          employeeId: 'fa505e1a-d875-41f3-adcb-1c15047fe28a',
          userProfile: {
            name: 'Jack',
          },
        },
        {
          userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
          telegramId: 5436134100,
          userProfile: {
            name: 'Jack',
          },
        },
      ]);
    });

    test('успех, когда в списке есть один пользователь, то возвращается один пользователь', () => {
      const result = sut.findByTelegramId(3290593910);
      expect(result).toEqual([
        {
          userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
          telegramId: 3290593910,
          employeeId: 'b1c357e6-fe52-4fcd-b61c-db98af09d9cc',
          userProfile: {
            name: 'Bill',
          },
        },
      ]);
    });

    test('успех, когда в списке нет пользователей с таким telegramId, приходит пустой массив', () => {
      const result = sut.findByTelegramId(55555533333);
      expect(result).toEqual([]);
    });
  });
});
