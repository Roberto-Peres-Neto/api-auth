import { MongoHelper, SequelizeHelper } from '@rpn-solution/utils-lib'
import 'dotenv/config'
import { addAlias } from 'module-alias'
import path from 'path'
import env from './config/env'
addAlias('@', path.join(__dirname, '../'))

// const test = await SequelizeHelper.connect()
  MongoHelper.connect(env.mongoUrl)
    .then(async () => {
      // const rabbit = (await import('./config/app')).rabbit
      // rabbit.start().then(async () => {
      // console.log('rabbit on')
       await SequelizeHelper.connect()
      const app = (await import('./config/app')).app
      app.listen(env.appPort, () => { console.log(`Server running at http://localhost:${env.appPort}`) })
    }).catch((error) => { console.log('error rabbit', error.message); process.exit(0) })
    // })
    .catch(console.error)