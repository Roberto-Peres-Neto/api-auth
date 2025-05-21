
import { bodyParser, contentType, cors } from '@rpn-solution/utils-lib'
import { type Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
