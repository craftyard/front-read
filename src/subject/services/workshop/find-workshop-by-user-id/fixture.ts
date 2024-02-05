import { GetMyWorkshopActionDod } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopAttrs } from 'cy-domain/src/workshop/domain-data/workshop/params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { TestResolverMock } from 'rilata/tests/fixtures/test-resolver-mock';
import { Mock, spyOn } from 'bun:test';
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { UserDoesNotExistError } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { Result } from 'rilata/src/common/result/types';
import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';

export class WorkshopRepoMock implements WorkshopReadRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
    throw new Error('Method not implemented.');
  }
}
export const resolver: ModuleResolver = new TestResolverMock();

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

const workshopRepo = new WorkshopRepoMock();

const userRepo = new UserRepoMock();

export const resolverGetUserWorkshopRepoMock = spyOn(
  resolver,
  'getRepository',
).mockImplementation((key: unknown) => {
  if (key === WorkshopReadRepository) return workshopRepo;
  if (key === UserReadRepository) return userRepo;
  throw Error('repository not found')
}) as Mock<(...args: unknown[]) => UserRepoMock | WorkshopRepoMock>;


export const inputOptions : GetMyWorkshopActionDod = {
  attrs: {
  },
  meta: {
    name: 'getMyWorkshop',
    actionId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d4444',
    domainType: 'action',
  },
};

export const workshop: (WorkshopAttrs) = {
  workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
  name: 'Nurbolat',
  city: 'Freital',
  address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
  location: { latitude: 88.958285, longitude: 117.84182 },
  employeesRole: { userIds: ['fb8a83cf-25a3-2b4f-86e1-27f6de6d8374', '3312a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
};
