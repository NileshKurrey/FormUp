import type { NextFunction } from 'express'
import { GroupService } from '../../application/group/groupService.js'
import type { IGroupRepository } from '../../domain/repositories/IGroupRepositry.js'
import type { IHttpRequest, IHttpResponse } from '../../domain/repositories/IHttpServer.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'
import { CatchAsync } from '../../shared/errors/catchAsyncFn.js'
import { ApiResponse } from '../../shared/utils/ApiResponse.js'
import { ApiError } from '../../shared/errors/ApiError.js'

export class GroupController {
  private groupService: IGroupRepository
  private container: ServiceContainer
  private logger: ILoggerRepository
  constructor() {
    this.groupService = new GroupService()
    this.container = createServiceContainer()
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
  addMemberToGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    // Implement in future
  })
  removeMemberFromGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    // Implement in future
  })
  addPostToGroup = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    // Implement in future
  })
}
