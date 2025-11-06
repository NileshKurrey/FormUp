import express from 'express'
import { GroupController } from '../controllers/GroupController.js'
import { authMiddleware } from '../middleware/auth.middlware.js'
export const groupsRouter = express.Router()

const groupController = new GroupController()

groupsRouter.post('', groupController.createGroup)
groupsRouter.put('/:id', groupController.updateGroup)
groupsRouter.delete('/:id', groupController.deleteGroup)
groupsRouter.get('/:id', groupController.findGroupById)
groupsRouter.get('/', groupController.findAllGroups)
groupsRouter.get('/cohort/:cohortId', groupController.findGroupsByCohortId)
groupsRouter.post('/:id/members', groupController.addMemberToGroup)
groupsRouter.delete('/:id/members/:memberId', groupController.removeMemberFromGroup)
groupsRouter.get('/:groupId/members', groupController.seeMembers)
groupsRouter.post('/applications/:groupId', authMiddleware, groupController.sendApplication)
groupsRouter.put('/applications/update', groupController.updateApplication)
groupsRouter.get('/applications/details/:applicationId', groupController.getApplicationDetails)
groupsRouter.delete('/applications/withdraw/:applicationId', groupController.withdrawApplication)
groupsRouter.get('/:groupId/applications', groupController.listApplications)
groupsRouter.post('/applications/:applicationId/approve', groupController.addMemberToGroup)
groupsRouter.post('/applications/:applicationId/reject', groupController.rejectApplication)
groupsRouter.get('/applications/:groupId/rejected', groupController.rejectedApplications)
groupsRouter.get('/applications/:groupId/approved', groupController.approvedApplications)
groupsRouter.get('/applications/:groupId/pending', groupController.pendingApplications)
