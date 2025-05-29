import * as dotenv from "dotenv";
import { IAuthentication } from "../../../domain/usecase";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AuthenticationRepository } from "../../protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../protocols/db/account";
dotenv.config();
export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly loadInformationUserAccountToUserCodeRepository: LoadInformationUserAccountToUserCodeRepository
  ) { }

  async login(request: IAuthentication.Request): Promise<IAuthentication.Response | null> {
    const { email, password } = request


    console.log('DbAuthentication.login', request)
    const userLogin = await this.authenticationRepository.authentication({ email, password })
    console.log('PRIMEIRO', userLogin)
    if (!userLogin) {
      return null
    }
    console.log('CODIGO', userLogin.userCode)
    const userAccountInformation = await this.loadInformationUserAccountToUserCodeRepository.loadUserInformation({
      userCode: userLogin.userCode
    })
    console.log('SEGUNDO', userAccountInformation)
    // console.log('NOMEEEE', userAccountInformation.personalInformation.completeName)
    if (!userAccountInformation) {
      throw new Error('User account information not found')
    }
    const accessToken = JwtAdapter.generate({
      accountModel: userAccountInformation[0],
      email: userLogin.email,
      accountStatus: userLogin.accountStatus,
      userCode: userLogin.userCode,
    },
      process.env.JWT_SECRET as string,
    )

    console.log('ACCESSTOKEN AQUI :', accessToken)
    return {
      email: userLogin.email,
      userCode: userLogin.userCode,
      accountStatus: userLogin.accountStatus,
      accessToken: accessToken,
      accountExpire: userLogin.accountExpire
    }
  }
}