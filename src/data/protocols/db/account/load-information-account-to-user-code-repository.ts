import { ILoadInformationUserAccountToUserCodeRequest, ILoadInformationUserAccountToUserCodeResponse } from "../../../../domain/models/account/load-information-user-account-to-user-code"

export interface LoadInformationUserAccountToUserCodeRepository {
  loadUserInformation: (request: LoadInformationUserAccountToUserCodeRepository.Request) => Promise<LoadInformationUserAccountToUserCodeRepository.Response | null>
}

export namespace LoadInformationUserAccountToUserCodeRepository {
  export type Request = ILoadInformationUserAccountToUserCodeRequest
  export type Response = ILoadInformationUserAccountToUserCodeResponse[]
}