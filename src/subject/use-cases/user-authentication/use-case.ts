import { Caller, CallerType } from 'rilata2/src/app/caller';
import { CommandValidatorMap } from 'rilata2/src/domain/validator/field-validator/types';
import { UserParams } from 'workshop-domain/src/subject/domain-data/user/params';
import { InstanceActionable } from 'rilata2/src/app/use-case/actionable/instance-actionable';
import { QueryUseCase } from 'rilata2/src/app/use-case/query-use-case';
import { GetUcOptions, GetUcResult } from 'rilata2/src/app/use-case/types';
import { BadRequestError, PermissionDeniedError, ValidationError } from 'rilata2/src/app/use-case/error-types';
import { Locale } from 'rilata2/src/domain/locale';
import { Result } from 'rilata2/src/common/result/types';
import { UserRepository } from 'workshop-domain/src/subject/domain-object/user/repository';
import { dodUtility } from 'rilata2/src/common/utils/domain-object/dod-utility';
import { failure } from 'rilata2/src/common/result/failure';
import { success } from 'rilata2/src/common/result/success';
import { SubjectAuthJWTManager } from 'subject/infra/jwt/jsonwebtoken-lib.jwt-manager';
import { jwtConfig } from 'subject/config/jwt/jwt-config';
import { JWTTokens } from 'rilata2/src/app/jwt/types';
import { TelegramAuthDTOValidator } from './user-auth.vmap';
import { AuthenticationUserUCParams } from './use-case-params';

export class AuthenticationUserUC
  extends QueryUseCase<AuthenticationUserUCParams>
  implements InstanceActionable<UserParams> {
  protected supportedCallers: ReadonlyArray<CallerType> = ['AnonymousUser'];

  protected inputValidator: CommandValidatorMap<AuthenticationUserUCParams['inputOptions']['query']>;

  protected validatorMap = TelegramAuthDTOValidator;

  actionType = 'instance' as const;

  aggregateName = 'UserAR' as const;

  actionName = 'userAuthentification' as const;

  protected async runDomain(options: GetUcOptions<AuthenticationUserUCParams>):
    Promise<GetUcResult<AuthenticationUserUCParams>> {
    throw new Error('Method not implemented.');
  }

  protected checkCallerPermission(caller: Caller):
    Result<PermissionDeniedError<Locale>, undefined> {
    if (this.supportedCallers.includes(caller.type)) {
      return success(undefined);
    }
    const err = dodUtility.getDomainErrorByType<PermissionDeniedError<Locale>>(
      'Permission denied',
      'Пользователь не аутентифицирован',
      {},
    );
    return failure(err);
  }

  protected checkValidations(
    input: GetUcOptions<AuthenticationUserUCParams>,
  ): Result<ValidationError | BadRequestError<Locale>, undefined> {
    const result = this.inputValidator.validate(input.query.attrs.id);

    if (result.isFailure()) {
      const err: ValidationError = {
        name: 'validation-error',
        domainType: 'error',
        errorType: 'app-error',
        errors: result.value,
      };
      return failure(err);
    }
    return result;
  }

  protected runInitialChecks(options: AuthenticationUserUCParams)
  : Promise<AuthenticationUserUCParams> {
    throw new Error('Method not implemented.');
  }

  actionIsAvailable(userId: string, ...args: unknown[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

new AuthenticationUserUC().execute(
  {
    query: {
      attrs: {
        first_name: '',
        last_name: '',
        username: '',
        photo_url: '',
        auth_date: '',
        hash: '',
      },
      name: 'AuthenticationUserUCQuery',
    },
    caller: {
      type: 'ModuleCaller',
      name: '',
      user: {
        type: 'AnonymousUser',
        requestID: '',
      },
    },
  },
);
