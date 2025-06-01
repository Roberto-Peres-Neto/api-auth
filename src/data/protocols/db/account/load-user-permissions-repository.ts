
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
  loadUserRole: (request: LoadUserRolesRepository.Request) => Promise<LoadUserRolesRepository.Response | null>
}

export namespace LoadUserRolesRepository {
  export type Request = {    userCode: string } 
  export type Response =[ {
    action: string
    subject: string
  }]
}

export interface LoadUserProfilesRepository {
  loadUserProfile: (request: LoadUserProfilesRepository.Request) => Promise<LoadUserProfilesRepository.Response | null>
}

export namespace LoadUserProfilesRepository {
  export type Request = {    userCode: string } 
  export type Response =[ {
    name: string
    desc: string
  }]
}

export interface GetMenuUserRepository {
  getMenuUser: (request: GetMenuUserRepository.Request) => Promise<GetMenuUserRepository.Response | null>
}

export namespace GetMenuUserRepository {
  export type Request = {    userCode: string } 
  export type Response = MenuModel[]
}

export type MenuModel = {
  id: string
  name: string
  route: string | null
  icon: string | null
  type: 'menu' | 'modal' | 'external'
  action: string | null
  subject: string | null
  order: number
  parentId: string | null
  children?: MenuModel[]
}
