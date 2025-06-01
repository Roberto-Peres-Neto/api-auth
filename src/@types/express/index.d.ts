import { AccessTokenPayload } from "../../infra/cryptography/jwt-adapter";

// src/@types/express/index.d.ts
// declare namespace Express {
//   interface Request {
//     user?: AccessTokenPayload

//     // user?: {
//     //   userCode: string
//     //   roles: Array<{ action: string; subject: string }>
//     //   permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
//     //   profile: Array<{ name: string; desc: string }>
//     // }
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload
    }
  }
}