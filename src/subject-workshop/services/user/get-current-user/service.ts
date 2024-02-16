import { QueryService } from 'rilata/src/app/service/query-service';
import { ActionDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';
import { getCurrentUserValidator } from 'cy-domain/src/subject/domain-data/user/get-current-user/v-map';
import { GetCurrentUserActionDod, GetingCurrentUserServiceParams } from 'cy-domain/src/subject/domain-data/user/get-current-user/s-params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { success } from 'rilata/src/common/result/success';

export class GettingUserService extends QueryService<GetingCurrentUserServiceParams> {
  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected name: 'getCurrentUser' = 'getCurrentUser' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap:
  ActionDodValidator<GetingCurrentUserServiceParams> = getCurrentUserValidator;

  protected async runDomain(
    actionDod: GetCurrentUserActionDod,
  ): Promise<ServiceResult<GetingCurrentUserServiceParams>> {
    const id = 'a29e2bfc-9f52-4f58-afbd-7a6f6f25d51e';
    const { userId } = actionDod.attrs;
    const repoUsers = UserReadRepository.instance(this.moduleResolver);
    const result = await repoUsers.getUser(userId);
    if ((result).isFailure()) {
      throw this.logger.error(`Пользователь с id: ${userId} подписонным токеном авторизации в базе данных не существует`);
    }
    const repoWorkshop = WorkshopReadRepository.instance(this.moduleResolver);
    const workshopAttrs = await repoWorkshop.findById(id);
    if (!workshopAttrs) {
      throw this.logger.error(`Workshop-a с таким workshopId: ${id} не сущесувует`);
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
