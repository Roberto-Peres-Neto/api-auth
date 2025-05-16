import Joi from 'joi'
import { AuthenticationAccountModelResponse } from '../../../domain/models'
import { LoadLoginController } from '../../../presentation/auth/load-login-controller'

export const authenticationModelJoiSchema = Joi.object < AuthenticationAccountModelResponse, true, AuthenticationAccountModelResponse>({
  accessToken: Joi.string().required(),
  accountStatus: Joi.string().required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  userCode: Joi.string().required()
})
export const loadLoginControllerJoiSchema = Joi.object < LoadLoginController.Request, true, LoadLoginController.Request>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
