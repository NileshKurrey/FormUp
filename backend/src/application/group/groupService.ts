import type { Applications, Group, Posts } from '../../domain/entities/Groups.js'
import {
  Actions,
  EntityType,
  type AuditLogEntity,
  type IAuditLogRepository,
} from '../../domain/repositories/IActivityRepositery.js'
import type { IDatabaseRepository } from '../../domain/repositories/IDatabaseRepostry.js'
import type {
  IApplicationsRepository,
  IGroupRepository,
  IPostsRepository,
} from '../../domain/repositories/IGroupRepositry.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'
import { ActivityService } from '../activity/activity.js'

export class GroupService implements IGroupRepository {
  container: ServiceContainer
  logger: ILoggerRepository
  database: IDatabaseRepository
  activityService: IAuditLogRepository
  model: string = 'groups'
  postModel: string = 'post'
  constructor() {
    this.container = createServiceContainer()
    this.logger = this.container.logger
    this.database = this.container.database
    this.activityService = new ActivityService()
  }
  async create(group: Group): Promise<Group> {
    const createdGroup = await this.database.create(this.model, group)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.CREATE.toString(),
      entityId: createdGroup.id,
      message: `Group created`,
      userId: createdGroup.createdBy,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return createdGroup
  }
  async update(group: Group): Promise<Group> {
    const updatedGroup = await this.database.updateById(this.model, group)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.CREATE.toString(),
      entityId: updatedGroup.id,
      message: `Group updated`,
      userId: updatedGroup.updatedBy,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return updatedGroup
  }
  async delete(id: string): Promise<void> {
    await this.database.deleteById(this.model, id)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.DISBAND.toString(),
      entityId: id,
      message: `Group deleted`,
      userId: 'system',
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
  }
  async findById(id: string): Promise<Group | null> {
    const group = await this.database.findById(this.model, id)
    return group
  }
  // only accessible for admins and moderators
  async findAll(): Promise<Group[]> {
    const groups = await this.database.findAll(this.model)
    return groups
  }
  async findByCohortId(cohortId: string): Promise<Group[]> {
    const groups = await this.database.findMany(this.model, { cohortId: cohortId })
    return groups
  }
  async addMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    if (!group.members.includes(userId) || group.members.length < 4) {
      group.members.push(userId)
    }
    await this.database.updateById(this.model, group)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.APPROVE.toString(),
      entityId: groupId,
      message: `User added to group ${group.name}`,
      userId: userId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return group
  }
  async removeMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    group.members = group.members.filter(memberId => memberId !== userId)
    await this.database.updateById(this.model, group)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.KICK.toString(),
      entityId: groupId,
      message: `Leader removed you from group ${group.name}`,
      userId: userId,
      timestamp: new Date(),
    }
    const logActionLeader: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.KICK.toString(),
      entityId: groupId,
      message: `You removed a member from group`,
      userId: group.leaderId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logActionLeader)
    this.activityService.logAction(logAction)
    return group
  }

  async seeMembers(groupId: string): Promise<Object> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    const members = group.members
    const detailedMembers: Array<any> = []
    members.map(membersId => {
      detailedMembers.push(this.database.findById('users', membersId))
    })
    return { members: detailedMembers }
  }
  async getGroupWithCurrentCohort(cohortId: string): Promise<Group[]> {
    const groups = await this.database.findMany(this.model, { cohortId: cohortId })
    return groups
  }
}

export class ApplicationsService implements IApplicationsRepository {
  container: ServiceContainer
  logger: ILoggerRepository
  activityService: IAuditLogRepository
  database: IDatabaseRepository
  model: string = 'Applications'
  constructor() {
    this.container = createServiceContainer()
    this.logger = this.container.logger
    this.activityService = new ActivityService()
    this.database = this.container.database
  }
  async sendApplication(application: Applications): Promise<Applications> {
    const checkApplication = await this.database.findOne(this.model, {
      where: { applicantId: application.applicantId, groupId: application.groupId },
    })
    if (checkApplication) {
      this.logger.error(
        `Application already exists for applicant ID ${application.applicantId} to group ID ${application.groupId}.`
      )
      throw new Error('Application already exists')
    }
    const createdApplication = await this.database.create(this.model, application)
    if (!createdApplication) {
      this.logger.error(`Application could not be created.`)
      throw new Error('Application creation failed')
    }

    const logAction: AuditLogEntity = {
      entityType: EntityType.APPLICATION,
      action: Actions.CREATE.toString(),
      entityId: createdApplication.id,
      message: `You Sent an Application to join the group `,
      userId: application.applicantId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)

    return createdApplication
  }
  async updateApplication(application: Applications): Promise<Applications> {
    const updatedApplication = await this.database.updateById(this.model, application)
    if (!updatedApplication) {
      this.logger.error(`Application with ID ${application.id} could not be updated.`)
      throw new Error('Application update failed')
    }

    const logAction: AuditLogEntity = {
      entityType: EntityType.APPLICATION,
      action: Actions.CREATE.toString(),
      entityId: updatedApplication.id,
      message: `You Updated your Application to join the group `,
      userId: updatedApplication.applicantId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)

    return updatedApplication
  }
  async listUserApplications(userId: string): Promise<Applications[]> {
    const applications = await this.database.findMany(this.model, { applicantId: userId })
    if (!applications) {
      this.logger.error(`No applications found for user ID ${userId}.`)
      throw new Error('No applications found')
    }
    return applications
  }
  async applicationById(applicationId: string): Promise<Applications | null> {
    const application = await this.database.findById(this.model, applicationId)
    if (!application) {
      this.logger.error(`Application with ID ${applicationId} not found.`)
      throw new Error('Application not found')
    }
    return application
  }
  async withdrawApplication(applicationId: string): Promise<Applications> {
    const application = await this.applicationById(applicationId)
    if (!application) {
      this.logger.error(`Application with ID ${applicationId} not found.`)
      throw new Error('Application not found')
    }
    application.status = 'withdrawn'
    const updatedApplication = await this.database.updateById(this.model, application)
    const logAction: AuditLogEntity = {
      entityType: EntityType.APPLICATION,
      action: Actions.WITHDRAW.toString(),
      entityId: updatedApplication.id,
      message: `You Withdrawn your Application to join the group `,
      userId: updatedApplication.applicantId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return updatedApplication
  }
  async listGroupApplications(groupId: string): Promise<Applications[]> {
    const applications = await this.database.findMany(this.model, { groupId: groupId })
    return applications
  }
  async approveApplication(applicationId: string): Promise<Applications> {
    const application = await this.applicationById(applicationId)
    if (!application) {
      this.logger.error(`Application with ID ${applicationId} not found.`)
      throw new Error('Application not found')
    }
    application.status = 'approved'
    const updatedApplication = await this.database.updateById(this.model, application)

    const logAction: AuditLogEntity = {
      entityType: EntityType.APPLICATION,
      action: Actions.APPROVE.toString(),
      entityId: updatedApplication.id,
      message: `You Approved your Application to join the group `,
      userId: updatedApplication.applicantId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)

    return updatedApplication
  }
  async rejectApplication(applicationId: string): Promise<Applications> {
    const application = await this.applicationById(applicationId)
    if (!application) {
      this.logger.error(`Application with ID ${applicationId} not found.`)
      throw new Error('Application not found')
    }
    application.status = 'rejected'
    const updatedApplication = await this.database.updateById(this.model, application)
    const logAction: AuditLogEntity = {
      entityType: EntityType.APPLICATION,
      action: Actions.DECLINE.toString(),
      entityId: updatedApplication.id,
      message: `Your Application to join the group has been Rejected`,
      userId: updatedApplication.applicantId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return updatedApplication
  }
  async rejectedApplications(groupId: string): Promise<Applications[]> {
    const applications = await this.database.findMany(this.model, { groupId: groupId, status: 'rejected' })
    return applications
  }
  async approvedApplications(groupId: string): Promise<Applications[]> {
    const applications = await this.database.findMany(this.model, { groupId: groupId, status: 'approved' })
    return applications
  }
  async pendingApplications(groupId: string): Promise<Applications[]> {
    const applications = await this.database.findMany(this.model, { groupId: groupId, status: 'pending' })
    return applications
  }
}

export class PostsService implements IPostsRepository {
  container: ServiceContainer
  logger: ILoggerRepository
  activityService: IAuditLogRepository
  database: IDatabaseRepository
  model: string = 'Post'
  constructor() {
    this.container = createServiceContainer()
    this.logger = this.container.logger
    this.activityService = new ActivityService()
    this.database = this.container.database
  }
  async createPost(postData: Posts): Promise<Posts> {
    const createdPost = await this.database.create(this.model, postData)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.POST_NOTICE.toString(),
      entityId: postData.groupId,
      message: `Leader created a post`,
      userId: createdPost.authorId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return createdPost
  }
  async getPostsByGroupId(groupId: string): Promise<Posts[]> {
    const posts = await this.database.findMany(this.model, { groupId: groupId })
    return posts
  }
  async editPost(postId: string, postData: Posts): Promise<Posts> {
    const updatedPost = await this.database.updateById(this.model, postData)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.POST_NOTICE.toString(),
      entityId: postData.groupId,
      message: `Leader edited a post`,
      userId: postData.postedby,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return updatedPost
  }
  async deletePost(postId: string): Promise<void> {
    await this.database.deleteById(this.model, postId)
    const logAction: AuditLogEntity = {
      entityType: EntityType.GROUP,
      action: Actions.POST_NOTICE.toString(),
      entityId: postId,
      message: `Leader deleted a post`,
      userId: postId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
  }
}
