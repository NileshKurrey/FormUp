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
groupsRouter.put('/applications/update', authMiddleware, groupController.updateApplication)
groupsRouter.get('/applications/details/:applicationId', authMiddleware, groupController.getApplicationDetails)
groupsRouter.delete('/applications/withdraw/:applicationId', authMiddleware, groupController.withdrawApplication)
groupsRouter.get('/:groupId/applications', authMiddleware, groupController.listApplications)
groupsRouter.post('/applications/:applicationId/approve', authMiddleware, groupController.addMemberToGroup)
groupsRouter.post('/applications/:applicationId/reject', authMiddleware, groupController.rejectApplication)
groupsRouter.get('/applications/:groupId/rejected', authMiddleware, groupController.rejectedApplications)
groupsRouter.get('/applications/:groupId/approved', authMiddleware, groupController.approvedApplications)
groupsRouter.get('/applications/:groupId/pending', authMiddleware, groupController.pendingApplications)

groupsRouter.post('/posts/:groupId', authMiddleware, groupController.addPostToGroup)
groupsRouter.get('/:groupId/posts', authMiddleware, groupController.listPostsInGroup)
groupsRouter.put('/posts/:postId/edit', authMiddleware, groupController.editPostInGroup)
groupsRouter.delete('/posts/:postId', authMiddleware, groupController.deletePostFromGroup)
