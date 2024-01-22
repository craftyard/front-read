import { GetMyWorkshopActionDod } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopAttrs } from 'cy-domain/src/workshop/domain-data/workshop/params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { TestResolverMock } from 'rilata/tests/fixtures/test-resolver-mock';
import { Mock, spyOn } from 'bun:test';

export class WorkshopRepoMock implements WorkshopReadRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
    throw new Error('Method not implemented.');
  }
}

export const resolver: ModuleResolver = new TestResolverMock();

export const resolverGetRepoMock = spyOn(
  resolver,
  'getRepository',
).mockReturnValue(new WorkshopRepoMock()) as Mock<(...args: unknown[]) => WorkshopRepoMock>;

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
