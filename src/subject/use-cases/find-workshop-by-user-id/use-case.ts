import { QueryUseCase } from 'rilata2/src/app/use-case/query-use-case';
import { UcResult } from 'rilata2/src/app/use-case/types';
import { GetMyWorkshopInputOptions, GetMyWorkshopUcParams, WorkshopForUserDoesntExistError } from 'workshop-domain/src/workshop/domain-data/workshop/find-workshop-by-user-id/uc-params';
import { WorkshopRepository } from 'workshop-domain/src/workshop/domain-object/workshop/repository';
import { getMyWorkshopValidator } from 'workshop-domain/src/workshop/domain-data/workshop/find-workshop-by-user-id/uc-vmap';
import { success } from 'rilata2/src/common/result/success';
import { DomainUser } from 'rilata2/src/app/caller';
import { failure } from 'rilata2/src/common/result/failure';
import { dodUtility } from 'rilata2/src/common/utils/domain-object/dod-utility';

export class FindWorkshopByUserIdUC extends QueryUseCase<GetMyWorkshopUcParams> {
  protected aRootName: 'WorkshopAR';

  protected name: 'getMyWorkshop' = 'getMyWorkshop' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap = getMyWorkshopValidator;

  protected async runDomain(
    options: GetMyWorkshopInputOptions,
  ): Promise<UcResult<GetMyWorkshopUcParams>> {
    const repo = WorkshopRepository.instance(this.moduleResolver);
    const workshop = await repo.findWorkshopByUserId((options.caller as DomainUser).userId);
    if (!workshop) {
      return failure(dodUtility.getDomainErrorByType<WorkshopForUserDoesntExistError>(
        'WorkshopForUserDoesntExistError',
        'Мастерская не найдена',
        {},
      ));
    }
    return success(workshop);
  }
}
