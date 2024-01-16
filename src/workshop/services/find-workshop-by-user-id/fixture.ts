import { GetMyWorkshopActionDod } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopAttrs } from 'cy-domain/src/workshop/domain-data/workshop/params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { StorePayload, ThreadStore } from 'rilata/src/app/async-store/types';
import { AnonymousUser, DomainUser } from 'rilata/src/app/caller';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { UuidType } from 'rilata/src/common/types';
import { TestResolverMock } from 'rilata/src/app/resolves/test-resolver-mock';
import { spyOn } from 'bun:test';

export class WorkshopRepoMock implements WorkshopReadRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
    throw new Error('Method not implemented.');
  }
}

const moduleResolver: ModuleResolver = new TestResolverMock();

export const workshopRepoMock = spyOn(moduleResolver, 'getRepository').mockReturnValueOnce(new WorkshopRepoMock());

const domainUser: DomainUser = {
  type: 'DomainUser',
  userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
};

const actionId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';

const domainUserStorePayload: StorePayload = {
  caller: domainUser,
  moduleResolver,
  actionId,
};

export const domainUserThreadStore: ThreadStore<StorePayload> = {
  run: () => {
    throw new Error('Method not implemented.');
  },
  getStore: () => domainUserStorePayload,
};

const anonymousUser:AnonymousUser = {
  type: 'AnonymousUser',
};

const anonymousUserStorePayload: StorePayload = {
  caller: anonymousUser,
  moduleResolver,
  actionId,
};

export const anonymousUserThreadStore: ThreadStore<StorePayload> = {
  run: () => {
    throw new Error('Method not implemented.');
  },
  getStore: () => anonymousUserStorePayload,
};
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
