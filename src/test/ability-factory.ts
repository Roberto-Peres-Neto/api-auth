import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'
type Subjects = string | 'all' // ex: 'GuiasPagamento', 'Clientes', etc.

export type AppAbility = MongoAbility<[Actions, Subjects]>

interface UserPermissions {
  permissions: string[] // ex: ['read:GuiasPagamento', 'update:Clientes']
  roles?: string[]
}

export function buildAbilityFor(user: UserPermissions): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  user.permissions.forEach((perm) => {
    const [action, subject] = perm.split(':')
    if (action && subject) can(action as Actions, subject)
  })

  return build()
}