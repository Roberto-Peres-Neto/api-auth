
export type AuthenticationAccountModelResponse = {
  email: string
  userCode: string
  accessToken: string
  accountStatus: string
  accountExpire: string
  roles: Array<{ action: string; subject: string }>
  permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
  profile: Array<{ name: string; desc: string }>
  menus: Array<{
    id: string
    name: string
    route: string | null
    icon: string | null
    type: 'menu' | 'modal' | 'external'
    action: string | null
    subject: string | null
    order: number
    parentId: string | null
    children?: Array<{
      id: string
      name: string
      route: string | null
      icon: string | null
      type: 'menu' | 'modal' | 'external'
      action: string | null
      subject: string | null
      order: number
      parentId: string | null
    }>
  }>
}