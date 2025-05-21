import { Router, type Express } from 'express'
import { readdirSync } from 'fs'

import path from 'path'

export default (app: Express): void => {
  const router = Router()
  const dirName = path.join(__dirname, '../routes')
  app.use('/erp-faveni', router)
  void readdirSync(dirName).map(async file => {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
