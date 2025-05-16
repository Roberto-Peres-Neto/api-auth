import { AuthenticationAccountModelResponse, AuthenticationRequest } from "../../../../domain/models"

export interface AuthenticationRepository {
  authentication: (request: AuthenticationRepository.Request) => Promise<AuthenticationRepository.Response | null>
}

export namespace AuthenticationRepository {
  export type Request = AuthenticationRequest
  export type Response = AuthenticationAccountModelResponse
}