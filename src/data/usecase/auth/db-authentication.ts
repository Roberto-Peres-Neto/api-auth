import * as dotenv from "dotenv";
import { IAuthentication } from "../../../domain/usecase";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AuthenticationRepository } from "../../protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../protocols/db/account";
import { LoadUserPermissionsRepository, LoadUserProfilesRepository, LoadUserRolesRepository } from "../../protocols/db/account/load-user-permissions-repository";
dotenv.config();
export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly loadInformationUserAccountToUserCodeRepository: LoadInformationUserAccountToUserCodeRepository,
    private readonly loadUserPermissionsRepository: LoadUserPermissionsRepository,
    private readonly loadUserRolesRepository: LoadUserRolesRepository,
    private readonly loadUserProfilesRepository: LoadUserProfilesRepository
  ) { }

  async login(request: IAuthentication.Request): Promise<IAuthentication.Response | null> {
    const { email, password } = request


    console.log('DbAuthentication.login', request)
    const userLogin = await this.authenticationRepository.authentication({ email, password })
    console.log('PRIMEIRO', userLogin)

    if (!userLogin) {
      return null
    }

    const permissionsResult = await this.loadUserPermissionsRepository.loadUserPermission({ userCode: userLogin.userCode }) ?? []

    const rolesResult = await this.loadUserRolesRepository.loadUserPermission({ userCode: userLogin.userCode }) ?? []


    const profilesResult = await this.loadUserProfilesRepository.loadUserPermission({ userCode: userLogin.userCode }) ?? []

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
      roles: (rolesResult ?? []).map(role => ({
        action: role.action,
        subject: role.subject
      })),
      permissions: (permissionsResult ?? []).map(permission => ({
        permissaoSigla: permission.permissionSigla,
        permissionDesciption: permission.permissionDescription
      })),
      profile: (profilesResult ?? []).map(profile => ({
        name: profile.name,
        desc: profile.desc
      }))
    },
      process.env.JWT_SECRET as string,
    )

    console.log('ACCESSTOKEN AQUI :', accessToken)
    return {
      email: userLogin.email,
      userCode: userLogin.userCode,
      accountStatus: userLogin.accountStatus,
      accessToken: accessToken,
      accountExpire: userLogin.accountExpire,
      permissions: profilesResult ?? [],
      roles: rolesResult ?? [],
      profile: profilesResult ?? []
    }
  }
}