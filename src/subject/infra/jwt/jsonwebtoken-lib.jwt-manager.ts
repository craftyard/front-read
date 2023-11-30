import {
  verify, sign,
} from 'jsonwebtoken';
import { failure } from 'rilata2/src/common/result/failure';
import { success } from 'rilata2/src/common/result/success';
import { Result } from 'rilata2/src/common/result/types';
import {
  IncorrectTokenTypeError,
  JsonWebTokenError, NotBeforeError, NotValidTokenPayloadError, TokenExpiredError, VerifyTokenError,
} from 'rilata2/src/app/jwt/errors';
import { dodUtility } from 'rilata2/src/common/utils/domain-object/dod-utility';
import { JWTDecodeLibJWTManager } from 'rilata2/src/infra/jwt/jwt-decode-lib.jwt-manager';
import { BackendJWTManager } from 'subject/app/jwt/backend-jwt-manager.interface';
import { JWTPayload, JwtTokens } from 'workshop-domain/src/subject/domain-data/user/user-authentification.a-params';
import { JWTConfig } from 'subject/config/jwt/types';
import { PlainJWTPayload, TokenType } from '../../app/jwt/types';

export class SubjectAuthJWTManager
  extends JWTDecodeLibJWTManager<JWTPayload> implements BackendJWTManager<JWTPayload> {
  constructor(private jwtConfig: JWTConfig) {
    super();
  }

  /**
   * Проверить и получить полезные данные jwt
   * @param rawToken токен для проверки
   * @param tokenType тип токена
   * @returns Result
   *   - success:
   *     - - PAYLOAD полезные данные jwt
   *   - failure:
   *     - - IncorrectTokenType - если указанные tokenType не совпадает с тем что в токене
   *     - - NotValidTokenPayload - если не валидные полезные данные
   *     - - TokenExpiredError - токен просрочен
   *     - - NotBeforeError - время работы токена ещё не наступило
   *     - - JsonWebTokenError - базовая ошибка библиотеки jsonwebtoken
   */
  verifyToken(rawToken: string, tokenType: TokenType):
    Result<VerifyTokenError, JWTPayload> {
    let verifyRes: PlainJWTPayload<JWTPayload>;
    try {
      verifyRes = verify(
        rawToken,
        this.jwtConfig.publicKey,
        { algorithms: [this.jwtConfig.algorithm], ignoreExpiration: false },
      ) as PlainJWTPayload<JWTPayload>;
    } catch (err) {
      switch ((<Error>err).constructor.name) {
        case 'TokenExpiredError':
          return failure(dodUtility.getDomainErrorByType<TokenExpiredError>(
            'TokenExpiredError',
            'Токен просрочен.',
            { rawToken },
          ));
        case 'NotBeforeError':
          return failure(dodUtility.getDomainErrorByType<NotBeforeError>(
            'NotBeforeError',
            'Время работы токена ещё не наступило.',
            { rawToken },
          ));
        case 'JsonWebTokenError':
          return failure(dodUtility.getDomainErrorByType<JsonWebTokenError>(
            'JsonWebTokenError',
            'Общая ошибка токена. Неуспешное действие.',
            { rawToken },
          ));
        default:
          throw err;
      }
    }
    const verifyPayloadRes = this.verifyPayload(verifyRes);
    if (verifyPayloadRes.isFailure()) {
      return failure(dodUtility.getDomainErrorByType<NotValidTokenPayloadError>(
        'NotValidTokenPayloadError',
        'Невалидная полезная нагрузка в токене.',
        { rawToken },
      ));
    }
    if (verifyRes.tokenType !== tokenType) {
      return failure(dodUtility.getDomainErrorByType<IncorrectTokenTypeError>(
        'IncorrectTokenTypeError',
        'Некорректный тип токена авторизации',
        { rawToken, givenType: verifyRes.tokenType, expectedType: tokenType },
      ));
    }
    return success(verifyPayloadRes.value.payload);
  }

  /** Проверить простые полезные данные jwt. */
  public verifyPayload<PP extends PlainJWTPayload<JWTPayload>>(
    payload: PP,
  ): Result<undefined, PP> {
    if (typeof payload !== 'object') return failure(undefined);
    if (!payload.payload) return failure(undefined);
    if (payload.tokenType as string !== 'access'
      && payload.tokenType as string !== 'refresh') return failure(undefined);
    if (typeof payload.payload !== 'object') return failure(undefined);
    if (this.checkPayloadInnerStructure(payload.payload).isFailure()) return failure(undefined);
    return success(payload);
  }

  createToken(payload: JWTPayload): JwtTokens {
    const accessToken = sign(
      this.getPlainPayload(payload, 'access'),
      this.jwtConfig.privateKey,
      {
        algorithm: this.jwtConfig.algorithm,
        expiresIn: this.jwtConfig.accessTokenExpiresIn,
      },
    );

    const refreshToken = sign(
      this.getPlainPayload(payload, 'refresh'),
      this.jwtConfig.privateKey,
      {
        algorithm: this.jwtConfig.algorithm,
        expiresIn: this.jwtConfig.refreshTokenExpiresIn,
      },
    );
    return { accessToken, refreshToken };
  }

  /** Проверить внутреннюю структуру конкретной полезной нагрузки */
  protected checkPayloadInnerStructure(
    payload: JWTPayload,
  ): Result<undefined, JWTPayload> {
    if (typeof payload.userId !== 'string') return failure(undefined);
    if (typeof payload.telegramId !== 'number') return failure(undefined);
    if (payload.employeeId && typeof payload.employeeId !== 'string') return failure(undefined);
    return success(payload);
  }

  protected getPlainPayload(
    payload: JWTPayload,
    tokenType: TokenType,
  ): PlainJWTPayload<JWTPayload> {
    return {
      tokenType,
      payload,
    };
  }
}
