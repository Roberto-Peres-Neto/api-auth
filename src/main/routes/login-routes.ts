import { Router } from "express"

export default (router: Router): void => {
  router.post('/admin/menu/:app/:branchCode', auth(null, null), adaptRoute(makeLoadMenuController()))
}