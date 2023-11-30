import { DTO } from 'rilata2/src/domain/dto';

export type TokenType = 'access' | 'refresh';

export type PlainJWTPayload<PAYLOAD extends DTO> = {
  tokenType: TokenType,
  payload: PAYLOAD,
};

export type DecodedToken<PAYLOAD extends DTO> = PlainJWTPayload<PAYLOAD> & {
  iat: number,
  exp: number,
};
