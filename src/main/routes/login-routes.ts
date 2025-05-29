import { adaptRoute } from "@rpn-solution/utils-lib"
import { Router } from "express"
import { makeLoadUserPermissionController } from "../factories/controller/auth/authentication-controller-factory"

export default (router: Router): void => {
  router.post('/auth/login', adaptRoute(makeLoadUserPermissionController()))
}