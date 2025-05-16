
import { Controller } from '@rpn-solution/utils-lib'
import { LoadLoginController } from '../../../../presentation/auth/load-login-controller'
import { makeDbAuthenticationFactory } from '../../usecase/auth/db-load-user-permission-factory'
import { makeDbAuthenticationValidation } from './authentication-validation-factory'

export const makeLoadUserPermissionController = (): Controller => {
  const controller = new LoadLoginController(
    makeDbAuthenticationValidation(),
    makeDbAuthenticationFactory()
  )
  return controller
  // return makeLogControllerDecorator(controller)
}
