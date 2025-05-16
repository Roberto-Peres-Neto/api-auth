import { IJoiValidation } from '@rpn-solution/utils-lib'
import { RequiredJoiSchemaValidation } from '@rpn-solution/utils-lib/dist/validation/joi-validation'
import { loadLoginControllerJoiSchema } from '../../../../validation/schema/auth/authentication-joi-schema'

export const makeDbAuthenticationValidation = (): IJoiValidation => {
  return new RequiredJoiSchemaValidation(loadLoginControllerJoiSchema)
}
