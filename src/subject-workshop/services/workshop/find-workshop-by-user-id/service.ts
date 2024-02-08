import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { FindWorkshopByUserIdActionDod, FindWorkshopByUserIdServiceParams, WorkshopForUserDoesntExistError } from 'cy-domain/src/workshop/domain-data/workshop/find-workshop-by-user-id/s-params';
import { WorkshopReadRepository } from 'cy-domain/src/workshop/domain-object/workshop/repository';
import { findWorkshopByUserIdValidator } from 'cy-domain/src/workshop/domain-data/workshop/find-workshop-by-user-id/s-vmap';
import { success } from 'rilata/src/common/result/success';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { UserReadRepository } from 'cy-domain/src/subject/domain-object/user/read-repository';

export class FindWorkshopByUserIdService extends QueryService<FindWorkshopByUserIdServiceParams> {
  protected aRootName: 'WorkshopAR' = 'WorkshopAR' as const;

  protected name: 'findWorkshopByUserId' = 'findWorkshopByUserId' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validatorMap = findWorkshopByUserIdValidator;

  protected async runDomain(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    actionDod: FindWorkshopByUserIdActionDod,
  ): Promise<ServiceResult<FindWorkshopByUserIdServiceParams>> {
    const repoWorkshop = WorkshopReadRepository.instance(this.moduleResolver);
    const workshop = await repoWorkshop.findWorkshopByUserId(actionDod.attrs.userId);
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
      employeesRole: usersAttrs,
    });
  }
}
