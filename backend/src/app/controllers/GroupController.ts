import type { NextFunction } from 'express'
import { ApplicationsService, GroupService, PostsService } from '../../application/group/groupService.js'
import type {
  IApplicationsRepository,
  IGroupRepository,
  IPostsRepository,
} from '../../domain/repositories/IGroupRepositry.js'
import type { IHttpRequest, IHttpResponse } from '../../domain/repositories/IHttpServer.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'
import { CatchAsync } from '../../shared/errors/catchAsyncFn.js'
import { ApiResponse } from '../../shared/utils/ApiResponse.js'
import { ApiError } from '../../shared/errors/ApiError.js'
import { ca, th } from 'zod/locales'
import { EntityType, type IAuditLogRepository } from '../../domain/repositories/IActivityRepositery.js'
import { ActivityService } from '../../application/activity/activity.js'

export class GroupController {
  private groupService: IGroupRepository
  private applicationsService: IApplicationsRepository
  private postsService: IPostsRepository
  private container: ServiceContainer
  private logger: ILoggerRepository
  private activityService: IAuditLogRepository
  constructor() {
    this.groupService = new GroupService()
    this.applicationsService = new ApplicationsService()
    this.postsService = new PostsService()
    this.container = createServiceContainer()
    this.activityService = new ActivityService()
    this.logger = this.container.logger
  }
  createGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const groupData = req.body
    const createGroup = await this.groupService.create(groupData)
    if (!createGroup) {
      this.logger.error('Failed to create group')
      res.status(500).json({ message: 'Failed to create group' })
      next(new ApiError(500, 'Failed to create group'))
    }
    res.status(201).json(new ApiResponse(200, createGroup, 'Group created successfully'))
  })

  updateGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const groupData = req.body
    const updateGroup = await this.groupService.update(groupData)
    if (!updateGroup) {
      this.logger.error('Failed to update group')
      res.status(500).json({ message: 'Failed to update group' })
      next(new ApiError(500, 'Failed to update group'))
    }
    res.status(200).json(new ApiResponse(200, updateGroup, 'Group updated successfully'))
  })

  deleteGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { id } = req.params
    if (!id) {
      this.logger.error('Group ID is required')
      res.status(400).json({ message: 'Group ID is required' })
      next(new Error('Group ID is required'))
      throw new ApiError(400, 'Group ID is required')
    }
    await this.groupService.delete(id)
    res.status(200).json(new ApiResponse(200, null, 'Group deleted successfully'))
  })

  findGroupById = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { id } = req.params
    if (!id) {
      this.logger.error('Group ID is required')
      res.status(400).json({ message: 'Group ID is required' })
      next(new Error('Group ID is required'))
      throw new ApiError(400, 'Group ID is required')
    }
    const group = await this.groupService.findById(id)
    res.status(200).json(new ApiResponse(200, group, 'Group fetched successfully'))
  })

  findAllGroups = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const groups = await this.groupService.findAll()
    res.status(200).json(new ApiResponse(200, groups, 'Groups fetched successfully'))
  })
  findGroupsByCohortId = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { cohortId } = req.params
    if (!cohortId) {
      this.logger.error('Cohort ID is required')
      res.status(400).json({ message: 'Cohort ID is required' })
      next(new Error('Cohort ID is required'))
      throw new ApiError(400, 'Cohort ID is required')
    }
    const groups = await this.groupService.findByCohortId(cohortId)
    res.status(200).json(new ApiResponse(200, groups, 'Groups fetched successfully'))
  })

  sendApplication = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const applicationData = req.body
    const groupId = req.params
    const userId = req.user?.id
    if (!userId) {
      this.logger.error('User ID is required to send application')
      res.status(400).json({ message: 'User ID is required to send application' })
      next(new Error('User ID is required to send application'))
      throw new ApiError(400, 'User ID is required to send application')
    }
    applicationData.applicantId = userId
    applicationData.groupId = groupId
    const application = await this.applicationsService.sendApplication(applicationData)
    if (!application) {
      this.logger.error('Failed to send application')
      res.status(500).json({ message: 'Failed to send application' })
      next(new ApiError(500, 'Failed to send application'))
    }
    res.status(201).json(new ApiResponse(200, application, 'Application sent successfully'))
  })
  updateApplication = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const applicationData = req.body
    const application = await this.applicationsService.updateApplication(applicationData)
    if (!application) {
      this.logger.error('Failed to update application')
      res.status(500).json({ message: 'Failed to update application' })
      next(new ApiError(500, 'Failed to update application'))
    }
    res.status(200).json(new ApiResponse(200, application, 'Application updated successfully'))
  })
  getApplicationDetails = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { applicationId } = req.params
    if (!applicationId) {
      this.logger.error('Application ID is required')
      res.status(400).json({ message: 'Application ID is required' })
      next(new Error('Application ID is required'))
      throw new ApiError(400, 'Application ID is required')
    }
    const application = await this.applicationsService.applicationById(applicationId)
    if (!application) {
      this.logger.error('Application not found')
      res.status(404).json({ message: 'Application not found' })
      next(new ApiError(404, 'Application not found'))
    }
    res.status(200).json(new ApiResponse(200, application, 'Application fetched successfully'))
  })
  withdrawApplication = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { applicationId } = req.params
    if (!applicationId) {
      this.logger.error('Application ID is required')
      res.status(400).json({ message: 'Application ID is required' })
      next(new Error('Application ID is required'))
      throw new ApiError(400, 'Application ID is required')
    }
    const application = await this.applicationsService.withdrawApplication(applicationId)
    if (!application) {
      this.logger.error('Failed to withdraw application')
      res.status(500).json({ message: 'Failed to withdraw application' })
      next(new ApiError(500, 'Failed to withdraw application'))
    }
    res.status(200).json(new ApiResponse(200, application, 'Application withdrawn successfully'))
  })
  listApplications = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required')
      res.status(400).json({ message: 'Group ID is required' })
      next(new Error('Group ID is required'))
      throw new ApiError(400, 'Group ID is required')
    }
    const applications = await this.applicationsService.listGroupApplications(groupId)
    if (!applications || applications.length === 0) {
      this.logger.error('No applications found for the group')
      res.status(404).json({ message: 'No applications found for the group' })
      next(new ApiError(404, 'No applications found for the group'))
    }
    res.status(200).json(new ApiResponse(200, applications, 'Applications fetched successfully'))
  })

  addMemberToGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { applicationId } = req.params
    if (!applicationId) {
      this.logger.error('Application ID is required to add member')
      res.status(400).json({ message: 'Application ID is required to add member' })
      next(new ApiError(400, 'Application ID is required to add member'))
      throw new ApiError(400, 'Application ID is required to add member')
    }
    const application = await this.applicationsService.applicationById(applicationId)
    if (!application || application === null) {
      this.logger.error(`Application with ID ${applicationId} not found.`)
      res.status(404).json({ message: 'Application not found' })
      next(new ApiError(404, 'Application not found'))
      throw new ApiError(404, 'Application not found')
    }
    const applicantId = application.applicantId
    const groupId = application.groupId
    const group = await this.groupService.addMember(groupId, applicantId)
    await this.applicationsService.approveApplication(applicationId)
    if (!group || group === null || group === undefined) {
      this.logger.error('Failed to add member to group')
      res.status(500).json({ message: 'Failed to add member to group' })
      next(new ApiError(500, 'Failed to add member to group'))
    }
    res.status(200).json(new ApiResponse(200, group, 'Application approved successfully'))
  })
  rejectApplication = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { applicationId } = req.params
    if (!applicationId) {
      this.logger.error('Application ID is required to reject application')
      res.status(400).json({ message: 'Application ID is required to reject application' })
      next(new Error('Application ID is required to reject application'))
      throw new ApiError(400, 'Application ID is required to reject application')
    }
    const application = await this.applicationsService.rejectApplication(applicationId)
    if (!application) {
      this.logger.error('Failed to reject application')
      res.status(500).json({ message: 'Failed to reject application' })
      next(new ApiError(500, 'Failed to reject application'))
    }
    res.status(200).json(new ApiResponse(200, application, 'Application rejected successfully'))
  })

  removeMemberFromGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    const { userId } = req.body
    if (!groupId || !userId) {
      this.logger.error('Group ID and User ID are required to remove member')
      res.status(400).json({ message: 'Group ID and User ID are required to remove member' })
      next(new Error('Group ID and User ID are required to remove member'))
      throw new ApiError(400, 'Group ID and User ID are required to remove member')
    }
    const group = await this.groupService.removeMember(groupId, userId)
    if (!group || group === null || group === undefined) {
      this.logger.error('Failed to remove member from group')
      res.status(500).json({ message: 'Failed to remove member from group' })
      next(new ApiError(500, 'Failed to remove member from group'))
    }
    res.status(200).json(new ApiResponse(200, group, 'Member removed successfully'))
  })

  seeMembers = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to see members')
      res.status(400).json({ message: 'Group ID is required to see members' })
      next(new Error('Group ID is required to see members'))
      throw new ApiError(400, 'Group ID is required to see members')
    }
    const members = await this.groupService.seeMembers(groupId)
    if (!members) {
      this.logger.error('Failed to fetch members')
      res.status(500).json({ message: 'Failed to fetch members' })
      next(new ApiError(500, 'Failed to fetch members'))
    }
    res.status(200).json(new ApiResponse(200, members, 'Members fetched successfully'))
  })
  rejectedApplications = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to fetch rejected applications')
      res.status(400).json({ message: 'Group ID is required to fetch rejected applications' })
      next(new Error('Group ID is required to fetch rejected applications'))
      throw new ApiError(400, 'Group ID is required to fetch rejected applications')
    }
    const applications = await this.applicationsService.rejectedApplications(groupId)
    res.status(200).json(new ApiResponse(200, applications, 'Rejected applications fetched successfully'))
  })
  approvedApplications = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to fetch approved applications')
      res.status(400).json({ message: 'Group ID is required to fetch approved applications' })
      next(new Error('Group ID is required to fetch approved applications'))
      throw new ApiError(400, 'Group ID is required to fetch approved applications')
    }
    const applications = await this.applicationsService.approvedApplications(groupId)
    res.status(200).json(new ApiResponse(200, applications, 'Approved applications fetched successfully'))
  })
  pendingApplications = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to fetch pending applications')
      res.status(400).json({ message: 'Group ID is required to fetch pending applications' })
      next(new Error('Group ID is required to fetch pending applications'))
      throw new ApiError(400, 'Group ID is required to fetch pending applications')
    }
    const applications = await this.applicationsService.pendingApplications(groupId)
    res.status(200).json(new ApiResponse(200, applications, 'Pending applications fetched successfully'))
  })
  addPostToGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const postData = req.body
    const { groupId } = req.params
    const userId = req.user?.id
    if (!userId || groupId === undefined) {
      this.logger.error('User ID and Group ID are required to add post')
      res.status(400).json({ message: 'User ID and Group ID are required to add post' })
      next(new Error('User ID and Group ID are required to add post'))
      throw new ApiError(400, 'User ID and Group ID are required to add post')
    }
    postData.postedby = userId
    postData.groupId = groupId
    const checkLeader = await this.groupService.findById(groupId)
    if (checkLeader?.leaderId !== userId) {
      this.logger.error('Only group leader can add posts')
      res.status(403).json({ message: 'Only group leader can add posts' })
      next(new Error('Only group leader can add posts'))
      throw new ApiError(403, 'Only group leader can add posts')
    }
    const post = await this.postsService.createPost(postData)
  })
  editPostInGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const postData = req.body
    const { postId } = req.params
    const userId = req.user?.id
    if (!userId || postId === undefined) {
      this.logger.error('User ID and Post ID are required to edit post')
      res.status(400).json({ message: 'User ID and Post ID are required to edit post' })
      next(new Error('User ID and Post ID are required to edit post'))
      throw new ApiError(400, 'User ID and Post ID are required to edit post')
    }
    const existingPosts = await this.postsService.getPostsByGroupId(postData.groupId)
    const postToEdit = existingPosts.find(post => post.id === postId)
    if (!postToEdit) {
      this.logger.error('Post not found')
      res.status(404).json({ message: 'Post not found' })
      next(new Error('Post not found'))
      throw new ApiError(404, 'Post not found')
    }
    if (postToEdit.postedby !== userId) {
      this.logger.error('Only the original poster can edit this post')
      res.status(403).json({ message: 'Only the original poster can edit this post' })
      next(new Error('Only the original poster can edit this post'))
      throw new ApiError(403, 'Only the original poster can edit this post')
    }
    const post = await this.postsService.editPost(postId, postData)
  })

  listPostsInGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to list posts')
      res.status(400).json({ message: 'Group ID is required to list posts' })
      next(new Error('Group ID is required to list posts'))
      throw new ApiError(400, 'Group ID is required to list posts')
    }
    const posts = await this.postsService.getPostsByGroupId(groupId)
    res.status(200).json(new ApiResponse(200, posts, 'Posts fetched successfully'))
  })

  deletePostFromGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { postId } = req.params
    const userId = req.user?.id
    if (!userId || postId === undefined) {
      this.logger.error('User ID and Post ID are required to delete post')
      res.status(400).json({ message: 'User ID and Post ID are required to delete post' })
      next(new Error('User ID and Post ID are required to delete post'))
      throw new ApiError(400, 'User ID and Post ID are required to delete post')
    }
    const existingPosts = await this.postsService.getPostsByGroupId(req.body.groupId)
    const postToDelete = existingPosts.find(post => post.id === postId)
    if (!postToDelete) {
      this.logger.error('Post not found')
      res.status(404).json({ message: 'Post not found' })
      next(new Error('Post not found'))
      throw new ApiError(404, 'Post not found')
    }
    if (postToDelete.postedby !== userId) {
      this.logger.error('Only the original poster can delete this post')
      res.status(403).json({ message: 'Only the original poster can delete this post' })
      next(new Error('Only the original poster can delete this post'))
      throw new ApiError(403, 'Only the original poster can delete this post')
    }
    await this.postsService.deletePost(postId)
    res.status(200).json(new ApiResponse(200, null, 'Post deleted successfully'))
  })
  getGroupLogs = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const { groupId } = req.params
    if (!groupId) {
      this.logger.error('Group ID is required to fetch logs')
      res.status(400).json({ message: "can't able to fetch logs, Group ID is missing" })
      next(new Error("can't able to fetch logs, Group ID is missing"))
      throw new ApiError(400, "can't able to fetch logs, Group ID is missing")
    }
    const logs = await this.activityService.getLogsByEntity(EntityType.GROUP, groupId)
    res.status(200).json(new ApiResponse(200, logs, 'Group logs fetched successfully'))
  })
}
