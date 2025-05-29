// src/@types/express/index.d.ts
declare namespace Express {
  interface Request {
    user?: {
      userCode: string
      permissions: string[]
      roles?: string[]
    }
  }
}
