import { AuthenticationAccountModelResponse, AuthenticationRequest } from "../../models"

export interface IAuthentication {
  login: (request: IAuthentication.Request) => Promise<IAuthentication.Response | null>
}

export namespace IAuthentication {
  export type Request = AuthenticationRequest
  export type Response = AuthenticationAccountModelResponse
}