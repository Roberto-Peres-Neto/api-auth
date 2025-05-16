import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter'

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const token = authHeader.replace('Bearer ', '')

  const decoded = JwtAdapter.verify(token, process.env.JWT_SECRET as string)

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }

  // Adiciona dados ao request para uso posterior
  req.user = decoded
  next()
}
