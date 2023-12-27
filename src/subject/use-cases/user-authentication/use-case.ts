import { QueryUseCase } from 'rilata/src/app/use-case/query-use-case';
import { UcResult } from 'rilata/src/app/use-case/types';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import {
  ManyAccountNotSupportedError, TelegramUserDoesNotExistError,
  UserAuthentificationInputOptions, UserAuthentificationUCParams,
} from 'cy-domain/src/subject/domain-data/user/user-authentification/uc-params';
import { userAuthentificationValidator } from 'cy-domain/src/subject/domain-data/user/user-authentification/v-map';
import { UserCmdRepository } from 'cy-domain/src/subject/domain-object/user/cmd-repository';
import { UserAuthentificationDomainQuery } from 'cy-domain/src/subject/domain-data/user/user-authentification/a-params';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';

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

    if (users.length > 1) {
      const err: ManyAccountNotSupportedError = dodUtility.getDomainErrorByType(
        'ManyAccountNotSupportedError',
        'У вас с одним аккаунтом telegram имеется много аккаунтов, к сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
        { telegramId },
      );
      return failure(err);
    } if (users.length === 0) {
      const err: TelegramUserDoesNotExistError = dodUtility.getDomainErrorByType(
        'TelegramUserDoesNotExistError',
        'У вас нет аккаунта.',
        { telegramId },
      );
      return failure(err);
    }

    const userAr = users[0];

    const userAuthQuery: UserAuthentificationDomainQuery = {
      botToken: this.moduleResolver.getRealisation('botToken') as string,
      telegramAuthDTO: options.actionDod.body,
    };
    const tokenCreator = TokenCreator.instance(this.moduleResolver);
    return userAr.userAuthentification(userAuthQuery, tokenCreator);
  }
}
