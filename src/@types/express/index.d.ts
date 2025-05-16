// src/@types/express/index.d.ts
declare namespace Express {
  interface Request {
    user?: {
      userCode: string
      email: string
      name: string
    }
  }
}
