import { badRequest, Controller, HttpResponse, IJoiValidation, ok, serverError, unauthorized } from "@rpn-solution/utils-lib"
import { AuthenticationAccountModelResponse, AuthenticationRequest } from "../../domain/models"
import { IAuthentication } from "../../domain/usecase"

export class LoadLoginController implements Controller {
  constructor(
    private readonly validation: IJoiValidation,
    private readonly authentication: IAuthentication,
  ) {}

  async handle(request: LoadLoginController.Request): Promise<HttpResponse<LoadLoginController.Response>> {
    try {
      const {error, value } = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }


      request = value

      const { email, password } = request
      const userLogin = await this.authentication.login({ email, password })

      if (!userLogin) {
        return unauthorized()
      }

      return ok({ userLogin })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadLoginController {
  export type Request = AuthenticationRequest
  export type Response = AuthenticationAccountModelResponse
}