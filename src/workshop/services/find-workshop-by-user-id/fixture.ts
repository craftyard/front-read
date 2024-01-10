import { Logger } from 'rilata/src/common/logger/logger';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { GetMyWorkshopActionDod } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopAttrs } from 'cy-domain/src/workshop/domain-data/workshop/params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { StorePayload, ThreadStore } from 'rilata/src/app/async-store/types';
import { AnonymousUser, DomainUser } from 'rilata/src/app/caller';
import { Database } from 'rilata/src/app/database/database';
import { TokenVerifier } from 'rilata/src/app/jwt/token-verifier.interface';
import { ModuleResolver } from 'rilata/src/app/resolves/module-resolver';
import { RunMode } from 'rilata/src/app/types';
import { UuidType } from 'rilata/src/common/types';
import { DTO } from 'rilata/src/domain/dto';
import { Module } from 'rilata/src/app/module/module';

export class WorkshopRepoMock implements WorkshopReadRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findWorkshopByUserId(userId: string): Promise<WorkshopAttrs | undefined> {
    throw new Error('Method not implemented.');
  }
}

export class ResolverMock implements ModuleResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(module: Module): void {
    throw new Error('Method not implemented.');
  }

  getRunMode(): RunMode {
    return 'test';
  }

  getModule(): Module {
    throw new Error('Method not implemented.');
  }

  private repoMock = new WorkshopRepoMock();

  getLogger(): Logger {
    return new ConsoleLogger();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRepository(repoKey: unknown): WorkshopReadRepository {
    return this.repoMock;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRealisation(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  getDatabase(): Database {
    throw new Error('Method not implemented.');
  }

  getTokenVerifier(): TokenVerifier<DTO> {
    throw new Error('Method not implemented.');
  }
}

const domainUser: DomainUser = {
  type: 'DomainUser',
  userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
};

const moduleResolver: ModuleResolver = new ResolverMock();

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
