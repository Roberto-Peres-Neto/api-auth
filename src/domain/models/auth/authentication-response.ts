
export type AuthenticationAccountModelResponse = {
  email: string
  userCode: string
  accessToken: string
  accountStatus: string
  accountExpire: string
  roles: Array<{ action: string; subject: string }>
  permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
  profile: Array<{ name: string; desc: string }>
}