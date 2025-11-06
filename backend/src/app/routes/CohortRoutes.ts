import { Router } from 'express'
import { CohortController } from '../controllers/CohortController.js'

const cohortController = new CohortController()
export const cohortRouter = Router()
cohortRouter.post('/', cohortController.createCohort)
cohortRouter.get('/:id', cohortController.getCohortById)
cohortRouter.put('/:id', cohortController.updateCohort)
// cohortRouter.delete("/:id", cohortController.deleteCohort);
// cohortRouter.get("/", cohortController.listCohorts);
