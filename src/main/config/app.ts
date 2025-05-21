import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

// const rabbit = new RabbitMqAdapter()

const app = express()
// setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export {
  app
}

