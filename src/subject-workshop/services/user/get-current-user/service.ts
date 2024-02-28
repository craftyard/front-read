import { QueryService } from 'rilata/src/app/service/query-service';
import { ActionDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { getCurrentUserValidator } from 'cy-domain/src/subject/domain-data/user/get-current-user/v-map';
import { GettingCurrentUserServiceParams } from 'cy-domain/src/subject/domain-data/user/get-current-user/s-params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { success } from 'rilata/src/common/result/success';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { DomainUser } from 'rilata/src/app/caller';

export class GettingCurrentUserService extends QueryService<GettingCurrentUserServiceParams> {
  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected name: 'getCurrentUser' = 'getCurrentUser' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap:
  ActionDodValidator<GettingCurrentUserServiceParams> = getCurrentUserValidator;

  protected async runDomain(): Promise<ServiceResult<GettingCurrentUserServiceParams>> {
    const workshopId = 'a29e2bfc-9f52-4f58-afbd-7a6f6f25d51e';
    const store = storeDispatcher.getStoreOrExepction();
    if (store.caller.type !== 'DomainUser') {
      throw this.logger.error('Пользователь не доменный пользователь');
    }
    const caller = store.caller as DomainUser;
    const { userId } = caller;
    const repoUsers = UserReadRepository.instance(this.moduleResolver);
    const result = await repoUsers.getUser(userId);
    if ((result).isFailure()) {
      throw await this.logger.error(`Пользователь с id: ${userId} подписанным токеном авторизации в базе данных не существует`);
    }
    const repoWorkshop = WorkshopReadRepository.instance(this.moduleResolver);
    const workshopAttrs = await repoWorkshop.findById(workshopId);
    if (!workshopAttrs) {
      throw await this.logger.error(`Workshop-a с workshopId: ${workshopId} не существует`);
    }
    return success({
      ...result.value,
      workshopName: workshopAttrs.name,
      workshopId: workshopAttrs.workshopId,
    });
  }
}
