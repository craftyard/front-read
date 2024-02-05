import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { GetMyWorkshopActionDod, GetMyWorkshopServiceParams, WorkshopForUserDoesntExistError } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { getMyWorkshopValidator } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-vmap';
import { success } from 'rilata/src/common/result/success';
import { DomainUser } from 'rilata/src/app/caller';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';

export class FindWorkshopByUserIdService extends QueryService<GetMyWorkshopServiceParams> {
  protected aRootName: 'WorkshopAR' = 'WorkshopAR' as const;

  protected name: 'getMyWorkshop' = 'getMyWorkshop' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap = getMyWorkshopValidator;

  protected async runDomain(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actionDod: GetMyWorkshopActionDod,
  ): Promise<ServiceResult<GetMyWorkshopServiceParams>> {
    const repoWorkshop = WorkshopReadRepository.instance(this.moduleResolver);
    const { caller } = storeDispatcher.getStoreOrExepction();
    const workshop = await repoWorkshop.findWorkshopByUserId((caller as DomainUser).userId);
    if (!workshop) {
      return failure(dodUtility.getDomainErrorByType<WorkshopForUserDoesntExistError>(
        'WorkshopForUserDoesntExistError' as const,
        'Мастерская не найдена',
        {},
      ));
    }
    const repoUsers = UserReadRepository.instance(this.moduleResolver);
    const usersAttrs = await repoUsers.getUsers(workshop.employeesRole.userIds);
    return success({
      ...workshop,
      employeesRole: {usersAttrs: usersAttrs},
    });
  }
}
