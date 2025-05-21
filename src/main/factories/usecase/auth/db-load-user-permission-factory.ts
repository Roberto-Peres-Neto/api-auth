import { DbAuthentication } from "../../../../data/usecase/auth/db-authentication"
import { IAuthentication } from "../../../../domain/usecase"
import { AuthenticationSequelizeRepository } from "../../../../infra/db/sequelize/auth/authentication-sequelize-repository"


export const makeDbAuthenticationFactory = (): IAuthentication => {
  const authUser = new AuthenticationSequelizeRepository()
  return new DbAuthentication(authUser,authUser)
}
