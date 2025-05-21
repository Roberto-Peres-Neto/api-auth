import { SequelizeHelper } from "@rpn-solution/utils-lib";
import { AuthenticationRepository } from "../../../../data/protocols/db";
import { LoadInformationUserAccountToUserCodeRepository } from "../../../../data/protocols/db/account";

export class AuthenticationSequelizeRepository implements AuthenticationRepository, LoadInformationUserAccountToUserCodeRepository {
  constructor(
    private readonly sequelize: typeof SequelizeHelper = SequelizeHelper
  ) { }

    async loadUserInformation (request: LoadInformationUserAccountToUserCodeRepository.Request): Promise<LoadInformationUserAccountToUserCodeRepository.Response | null> {
    const { userCode } = request
    const sql = `EXEC sp_get_user_full_data @USERCODE = :userCode`
    const replacements = {
      userCode: new String(userCode)
    }
    const dbResult = await this.sequelize.query<LoadInformationUserAccountToUserCodeRepository.Response>(sql, replacements)
    if (!dbResult || dbResult.length === 0) {
      return null
    }
    return dbResult[0]
  }


async authentication (request: AuthenticationRepository.Request): Promise<AuthenticationRepository.Response | null> {    
  const { email, password } = request
    const sql = `SELECT * FROM users WHERE email = :email AND password = :password`
    
    const replacements = {
      email: new String(email),
      password: new String(password)
    }

  const dbResult = await this.sequelize.query<AuthenticationRepository.Response>(sql, replacements)

    if (!dbResult || dbResult.length === 0) {
      return null
    }

    return dbResult[0]
  }
}