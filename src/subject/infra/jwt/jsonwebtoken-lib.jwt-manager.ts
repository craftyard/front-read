import {
  verify, sign, Algorithm, JwtPayload,
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
import { BackendJWTManager } from 'subject/backend-jwt-manager.interface';
import { JWTPayload, JwtTokens } from 'workshop-domain/src/subject/domain-data/user/user-authentification.a-params';
import { PlainJWTPayload, TokenType } from './types';

export class SubjectAuthJWTManager
  extends JWTDecodeLibJWTManager<JwtPayload> implements BackendJWTManager<JwtPayload> {
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
    Result<VerifyTokenError, JwtPayload> {
    let verifyRes: PlainJWTPayload<JwtPayload>;
    try {
      verifyRes = verify(
        rawToken,
        this.getPublicKey(),
        { algorithms: [this.getAlgorithm()], ignoreExpiration: false },
      ) as PlainJWTPayload<JwtPayload>;
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
  public verifyPayload<PP extends PlainJWTPayload<JwtPayload>>(
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
      this.getPrivateKey(),
      {
        algorithm: this.getAlgorithm(),
        expiresIn: this.getAccessExpiresIn(),
      },
    );

    const refreshToken = sign(
      this.getPlainPayload(payload, 'refresh'),
      this.getPrivateKey(),
      {
        algorithm: this.getAlgorithm(),
        expiresIn: this.getRefreshExpiresIn(),
      },
    );
    return { accessToken, refreshToken };
  }

  /** Получить открытый ключ подписи токена. */
  protected getPublicKey(): string {
    return process.env.JWT_PUBLIC_KEY as string;
  }

  /** Получить алгоритм подписи токена. */
  protected getAlgorithm(): Algorithm {
    return 'RS512';
  }

  /** Проверить внутреннюю структуру конкретной полезной нагрузки */
  protected checkPayloadInnerStructure(
    payload: JwtPayload,
  ): Result<undefined, JwtPayload> {
    if (typeof payload.userID !== 'string') return failure(undefined);
    if (typeof payload.govPersonID !== 'string') return failure(undefined);
    return success(payload);
  }

  /** Получить закрытый ключ подписи токена. */
  protected getPrivateKey(): string {
    return process.env.JWT_PRIVATE_KEY as string;
  }

  /** Получить значение через сколько истекает время токена доступа.
   * Возможные значения:
   * года - '1y',
   * дни - '2d',
   * часы - '10h',
   * минуты - '1m',
   * секунды - '5s',
   * миллисекунды - '100ms'.
  */
  protected getAccessExpiresIn(): string {
    return '10h';
  }

  /** Получить значение через сколько истекает время токена обновления.
   * Возможные значения такие же, как и для метода getAccessExpiresIn.
  */
  protected getRefreshExpiresIn(): string {
    return '3d';
  }

  protected getPlainPayload(
    payload: JwtPayload,
    tokenType: TokenType,
  ): PlainJWTPayload<JwtPayload> {
    return {
      tokenType,
      payload,
    };
  }
}
