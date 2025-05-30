import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'
type Subjects = string | 'all' // ex: 'GuiasPagamento', 'Clientes', etc.

export type AppAbility = MongoAbility<[Actions, Subjects]>

interface UserPermissions {
  roles: Array<{ action: string; subject: string }>
}

export function buildAbilityFor(user: UserPermissions): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  user.roles.forEach((perm) => {
    can(perm.action as Actions, perm.subject)
  })

  return build()
}