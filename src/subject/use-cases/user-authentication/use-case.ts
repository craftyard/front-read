import { QueryUseCase } from 'rilata2/src/app/use-case/query-use-case';
import { UcResult } from 'rilata2/src/app/use-case/types';
import { TokenCreator } from 'rilata2/src/app/jwt/token-creator.interface';
import {
  ManyEmployeeAccountNotSupportedError, EmployeeUserDoesNotExistError,
  UserAuthentificationInputOptions, UserAuthentificationUCParams,
} from 'workshop-domain/src/subject/domain-data/user/user-authentification/uc-params';
import { userAuthentificationValidator } from 'workshop-domain/src/subject/domain-data/user/user-authentification/v-map';
import { UserCmdRepository } from 'workshop-domain/src/subject/domain-object/user/cmd-repository';
import { UserAuthentificationDomainQuery } from 'workshop-domain/src/subject/domain-data/user/user-authentification/a-params';
import { failure } from 'rilata2/src/common/result/failure';
import { dodUtility } from 'rilata2/src/common/utils/domain-object/dod-utility';

export class UserAuthentificationUC extends QueryUseCase<UserAuthentificationUCParams> {
  protected name: 'userAuthentification' = 'userAuthentification' as const;

  protected aRootName: 'UserAR' = 'UserAR' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['AnonymousUser'];

  protected validatorMap = userAuthentificationValidator;

  protected async runDomain(
    options: UserAuthentificationInputOptions,
  ): Promise<UcResult<UserAuthentificationUCParams>> {
    const userRepo = UserCmdRepository.instance(this.moduleResolver);
    const telegramId = options.actionDod.body.id;
    const users = await userRepo.findByTelegramId(telegramId);
    const employeeUsers = users.filter((user) => user.getType() === 'employee');

    if (employeeUsers.length > 1) {
      const err: ManyEmployeeAccountNotSupportedError = dodUtility.getDomainErrorByType(
        'TwoEmployeeAccountNotSupportedError',
        'У вас с одним аккаунтом telegram имеется два пользовательских аккаунта сотрудников. К сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
        { telegramId },
      );
      return failure(err);
    } if (employeeUsers.length === 0) {
      const err: EmployeeUserDoesNotExistError = dodUtility.getDomainErrorByType(
        'EmployeeUserDoesNotExistError',
        'У вас нет аккаунта сотрудника.',
        { telegramId },
      );
      return failure(err);
    }

    const userAr = employeeUsers[0];

    const userAuthQuery: UserAuthentificationDomainQuery = {
      botToken: this.moduleResolver.getRealisation('botToken') as string,
      telegramAuthDTO: options.actionDod.body,
    };
    const tokenCreator = TokenCreator.instance(this.moduleResolver);
    return userAr.userAuthentification(userAuthQuery, tokenCreator);
  }
}
