import { QueryService } from 'rilata/src/app/service/query-service';
import { ActionDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { getCurrentUserValidator } from 'cy-domain/src/subject/domain-data/user/get-current-user/v-map';
import { GetingCurrentUserServiceParams } from 'cy-domain/src/subject/domain-data/user/get-current-user/s-params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { success } from 'rilata/src/common/result/success';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { DomainUser } from 'rilata/src/app/caller';

export class GettingCurrentUserService extends QueryService<GetingCurrentUserServiceParams> {
  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected name: 'getCurrentUser' = 'getCurrentUser' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validatorMap:
  ActionDodValidator<GetingCurrentUserServiceParams> = getCurrentUserValidator;

  protected async runDomain(): Promise<ServiceResult<GetingCurrentUserServiceParams>> {
    const id = 'a29e2bfc-9f52-4f58-afbd-7a6f6f25d51e';
    const store = storeDispatcher.getStoreOrExepction();
    if (store.caller.type !== 'DomainUser') {
      throw this.logger.error('Пользователь не доменный пользователь');
    }
    const caller = store.caller as DomainUser;
    const idUser = caller.userId;
    const repoUsers = UserReadRepository.instance(this.moduleResolver);
    const result = await repoUsers.getUser(idUser);
    if ((result).isFailure()) {
      throw await this.logger.error(`Пользователь с id: ${idUser} подписонным токеном авторизации в базе данных не существует`);
    }
    const repoWorkshop = WorkshopReadRepository.instance(this.moduleResolver);
    const workshopAttrs = await repoWorkshop.findById(id);
    if (!workshopAttrs) {
      throw await this.logger.error(`Workshop-a с таким workshopId: ${id} не существует`);
    }
    const workshopName = workshopAttrs.name;
    const { workshopId } = workshopAttrs;
    return success({
      ...result.value,
      workshopName,
      workshopId,
    });
  }
}
