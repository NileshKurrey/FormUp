import express from 'express'
import { GroupController } from '../controllers/GroupController.js'
export const groupsRouter = express.Router()

const groupController = new GroupController()

groupsRouter.post('/', groupController.createGroup)
groupsRouter.put('/:id', groupController.updateGroup)
groupsRouter.delete('/:id', groupController.deleteGroup)
groupsRouter.get('/:id', groupController.findGroupById)
groupsRouter.get('/', groupController.findAllGroups)
groupsRouter.get('/cohort/:cohortId', groupController.findGroupsByCohortId)
groupsRouter.post('/:id/members', groupController.addMemberToGroup)
groupsRouter.delete('/:id/members/:memberId', groupController.removeMemberFromGroup)
groupsRouter.post('/:id/posts', groupController.addPostToGroup)
