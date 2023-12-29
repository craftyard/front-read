import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { GetMyWorkshopActionDod, GetMyWorkshopServiceParams, WorkshopForUserDoesntExistError } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-params';
import { WorkshopRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { getMyWorkshopValidator } from 'cy-domain/src/workshop/domain-data/workshop/get-my-workshop/s-vmap';
import { success } from 'rilata/src/common/result/success';
import { DomainUser } from 'rilata/src/app/caller';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';

export class FindWorkshopByUserIdService extends QueryService<GetMyWorkshopServiceParams> {
  protected aRootName: 'WorkshopAR';

  protected name: 'getMyWorkshop' = 'getMyWorkshop' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap = getMyWorkshopValidator;

  protected async runDomain(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: GetMyWorkshopActionDod,
  ): Promise<ServiceResult<GetMyWorkshopServiceParams>> {
    const repo = WorkshopRepository.instance(this.moduleResolver);
    const { caller } = storeDispatcher.getStoreOrExepction();
    const workshop = await repo.findWorkshopByUserId((caller as DomainUser).userId);
    if (!workshop) {
      return failure(dodUtility.getDomainErrorByType<WorkshopForUserDoesntExistError>(
        'WorkshopForUserDoesntExistError' as const,
        'Мастерская не найдена',
        {},
      ));
    }
    return success(workshop);
  }
}
