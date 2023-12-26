/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  describe, test, expect, spyOn,
} from 'bun:test';
import { ConsoleLogger } from 'rilata2/src/common/logger/console-logger';
import { GetMyWorkshopInputOptions, GetMyWorkshopOut, WorkshopForUserDoesntExistError } from 'workshop-domain/src/workshop/domain-data/workshop/find-workshop-by-user-id/uc-params';
import { ModuleResolver } from 'rilata2/src/conf/module-resolver';
import { Logger } from 'rilata2/src/common/logger/logger';
import { WorkshopRepository } from 'workshop-domain/src/workshop/domain-object/workshop/repository';
import { WorkshopAttrs } from 'workshop-domain/src/workshop/domain-data/workshop/params';
import { Database } from 'rilata2/src/app/database';
import { FindWorkshopByUserIdUC } from './use-case';

export class WorkshopRepoMock implements WorkshopRepository {
  findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
    throw new Error('Method not implemented.');
  }
}

export class ResolverMock implements ModuleResolver {
  private repoMock = new WorkshopRepoMock();

  getLogger(): Logger {
    return new ConsoleLogger();
  }

  getRepository(repoKey: unknown): WorkshopRepository {
    return this.repoMock;
  }

  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }
}

describe('тесты для use-case getMyWorkshop', () => {
  const sut = new FindWorkshopByUserIdUC();
  const resolver = new ResolverMock();
  sut.init(resolver);

  const validInputOptions: GetMyWorkshopInputOptions = {
    actionDod: {
      actionName: 'getMyWorkshop',
      body: {
      },
    },
    caller: {
      type: 'DomainUser',
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
      requestID: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8344',
    },
  };
  const notValidInputOptions: GetMyWorkshopInputOptions = {
    actionDod: {
      actionName: 'getMyWorkshop',
      body: {
      },
    },
    caller: {
      type: 'DomainUser',
      userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d4444',
      requestID: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d4444',
    },
  };

  const workshop: (WorkshopAttrs) = {
    workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
    name: 'Nurbolat',
    city: 'Freital',
    address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
    location: { latitude: 88.958285, longitude: 117.84182 },
    employeesRole: { userIds: ['fb8a83cf-25a3-2b4f-86e1-27f6de6d8374', '3312a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
  };

  test('успех, запрос для получения workshop-а успешно проходит', async () => {
    const getWorkshopMock = spyOn(
      resolver.getRepository('repoKey'),
      'findWorkshopByUserId',
    ).mockResolvedValueOnce(workshop);
    const result = await sut.execute(validInputOptions);
    expect(result.isSuccess()).toBe(true);
    expect(result.value as GetMyWorkshopOut).toEqual(workshop);
    expect(getWorkshopMock).toHaveBeenCalledTimes(1);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
  });

  test('провал, мастерская не найдена', async () => {
    const getWorkshopMock = spyOn(
      resolver.getRepository('repoKey'),
      'findWorkshopByUserId',
    ).mockResolvedValueOnce(undefined);
    const result = await sut.execute(notValidInputOptions);
    expect(result.isFailure()).toBe(true);
    expect(result.value as WorkshopForUserDoesntExistError).toEqual({
      name: 'WorkshopForUserDoesntExistError',
      locale: {
        text: 'Мастерская не найдена',
        hint: {},
      },
      errorType: 'domain-error',
      domainType: 'error',
    });
    expect(getWorkshopMock).toHaveBeenCalledTimes(2);
    expect(getWorkshopMock.mock.calls[0][0]).toBe('fb8a83cf-25a3-2b4f-86e1-27f6de6d8374');
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
