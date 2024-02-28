/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { UserAttrs } from 'cy-domain/src/subject/domain-data/user/params';
import { UserAR } from 'cy-domain/src/subject/domain-object/user/a-root';
import { UuidType } from 'rilata/src/common/types';
import { GetUsersActionDod } from 'cy-domain/src/subject/domain-data/user/get-users/s-params';
import { Mock, spyOn } from 'bun:test';
import { UserDoesNotExistError } from 'cy-domain/src/subject/domain-data/user/get-user/s-params';
import { Result } from 'rilata/src/common/result/types';
import { TestResolverMock, resolver } from 'rilata/tests/fixtures/test-resolver-mock';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { WorkshopAttrs } from 'cy-domain/src/workshop/domain-data/workshop/params';

export namespace SubjectServiceFixtures {
  export class WorkshopRepoMock implements WorkshopReadRepository {
    findById(workshopId: string): Promise<WorkshopAttrs | undefined> {
      throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
      throw new Error('Method not implemented.');
    }
  }

  export class UserRepoMock implements UserCmdRepository, UserReadRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findByTelegramId(telegramId: number): Promise<UserAR[]> {
      throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUsers(userIds: string[]): Promise<UserAttrs[]> {
      throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    throw Error(`repository not found for key: ${key}`);
  }) as Mock<(...args: unknown[]) => UserRepoMock | WorkshopRepoMock>;

export const workshop: (WorkshopAttrs) = {
  workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
  name: 'TheBestWorkshop',
  city: 'Freital',
  address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
  location: { latitude: 88.958285, longitude: 117.84182 },
  employeesRole: { userIds: ['fb8a83cf-25a3-2b4f-86e1-27f6de6d8374', '3312a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
};
}
