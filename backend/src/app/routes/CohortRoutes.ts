import { Router } from 'express'
import { CohortController } from '../controllers/CohortController.js'

const cohortController = new CohortController()
export const cohortRouter = Router()
cohortRouter.post('/create', cohortController.createCohort)
cohortRouter.get('/:id', cohortController.getCohortById)
cohortRouter.put('/update/:id', cohortController.updateCohort)
// cohortRouter.delete("/:id", cohortController.deleteCohort);
cohortRouter.get('/list', cohortController.listCohorts)
