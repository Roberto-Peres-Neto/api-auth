
export interface LoadUserPermissionsRepository {
  loadUserPermission: (request: LoadUserPermissionsRepository.Request) => Promise<LoadUserPermissionsRepository.Response | null>
}

export namespace LoadUserPermissionsRepository {
  export type Request = {    userCode: string } 
  export type Response = [{
    permissionSigla: string
    permissionDescription: string
  }]
}

export interface LoadUserRolesRepository {
  loadUserPermission: (request: LoadUserRolesRepository.Request) => Promise<LoadUserRolesRepository.Response | null>
}

export namespace LoadUserRolesRepository {
  export type Request = {    userCode: string } 
  export type Response =[ {
    action: string
    subject: string
  }]
}

export interface LoadUserProfilesRepository {
  loadUserPermission: (request: LoadUserProfilesRepository.Request) => Promise<LoadUserProfilesRepository.Response | null>
}

export namespace LoadUserProfilesRepository {
  export type Request = {    userCode: string } 
  export type Response =[ {
    name: string
    desc: string
  }]
}