// src/main/middlewares/auth.ts
import { ForbiddenError } from '@casl/ability'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { AccessTokenPayload } from '../infra/cryptography/jwt-adapter'
import { Actions, buildAbilityFor } from './ability-factory'


export const auth = (subject: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        res.status(401).json({ error: 'Access token is missing' })
        return
      }

      const payload = verify(token, process.env.JWT_SECRET!) as AccessTokenPayload

      const user = {
        userCode: payload.userCode,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        profile: payload.profile || [],
        email: payload.email,
        accountStatus: payload.accountStatus,
        accountModel: payload.accountModel,
      }

      req.user = user

      const validActions: Actions[] = ['read', 'create', 'update', 'delete', 'manage']

      if (!validActions.includes(action as Actions)) {
        return res.status(400).json({ error: `Invalid action: ${action}` })
      }

      const ability = buildAbilityFor(user)
      ForbiddenError.from(ability).throwUnlessCan(action as Actions, subject)

      return next()
    } catch (err: unknown) {
      const status = err instanceof ForbiddenError ? 403 : 401
      res.status(status).json({ error: (err as Error).message })
      return
    }
  }
}