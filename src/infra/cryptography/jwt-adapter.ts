import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { ILoadInformationUserAccountToUserCodeResponse } from '../../domain/models/account/load-information-user-account-to-user-code';

type AccessTokenPayload = {
  email: string
  name: string
  userCode: string
  accountStatus: string
  accountModel: ILoadInformationUserAccountToUserCodeResponse
}

export class JwtAdapter {
  static generate(payload: AccessTokenPayload, secret: string, expiresIn: StringValue  = '4h'): string {
    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, secret, options)
  }

  static verify(token: string, secret: string): AccessTokenPayload | null {
    try {
      return jwt.verify(token, secret) as AccessTokenPayload
    } catch {
      return null
    }
  }
}
