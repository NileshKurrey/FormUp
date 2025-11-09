import type { NextFunction } from 'express'
import { CohortService } from '../../application/cohort/cohortService.js'
import type { IHttpRequest, IHttpResponse } from '../../domain/repositories/IHttpServer.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'
import { CatchAsync } from '../../shared/errors/catchAsyncFn.js'
import { ApiResponse } from '../../shared/utils/ApiResponse.js'
import { ApiError } from '../../shared/errors/ApiError.js'
import { EntityType, type IAuditLogRepository } from '../../domain/repositories/IActivityRepositery.js'
import { ActivityService } from '../../application/activity/activity.js'
export class CohortController {
  private cohortService: CohortService
  private container: ServiceContainer
  private logger: ILoggerRepository
  private activityService: IAuditLogRepository
  constructor() {
    this.cohortService = new CohortService()
    this.container = createServiceContainer()
    this.logger = this.container.logger
    this.activityService = new ActivityService()
  }
  createCohort = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const cohortData = req.body
    if (!cohortData) {
      this.logger.error('No cohort data provided in the request body')
      next(new ApiError(400, 'No cohort data provided'))
      return res.status(400).json(new ApiResponse(400, '', 'No cohort data provided'))
    }
    const newCohort = await this.cohortService.createCohort(cohortData)
    if (!newCohort) {
      this.logger.error('Failed to create cohort')
      next(new ApiError(500, 'Failed to create cohort'))
      return res.status(500).json(new ApiResponse(500, '', 'Failed to create cohort'))
    }
    res.status(201).json(new ApiResponse(201, newCohort, 'Cohort created successfully'))
  })
  getCohortById = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const cohortId = req.params.id
    if (!cohortId) {
      this.logger.error('Cohort ID is required')
      next(new ApiError(400, 'Cohort ID is required'))
      return res.status(400).json(new ApiResponse(400, '', 'Cohort ID is required'))
    }
    const cohort = await this.cohortService.getCohortById(cohortId)
    if (!cohort) {
      this.logger.error(`Cohort with ID ${cohortId} not found`)
      next(new ApiError(404, 'Cohort not found'))
      return res.status(404).json(new ApiResponse(404, '', 'Cohort not found'))
    }
    res.status(200).json(new ApiResponse(200, cohort, 'Cohort retrieved successfully'))
  })
  updateCohort = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const cohortId = req.params.id
    const updateData = req.body
    if (!cohortId) {
      this.logger.error('Cohort ID is required')
      next(new ApiError(400, 'Cohort ID is required'))
      return res.status(400).json(new ApiResponse(400, '', 'Cohort ID is required'))
    }
    if (!updateData) {
      this.logger.error('No update data provided')
      next(new ApiError(400, 'No update data provided'))
      return res.status(400).json(new ApiResponse(400, '', 'No update data provided'))
    }
    const updatedCohort = await this.cohortService.updateCohort(cohortId, updateData)
    if (!updatedCohort) {
      this.logger.error(`Failed to update cohort with ID ${cohortId}`)
      next(new ApiError(500, 'Failed to update cohort'))
      return res.status(500).json(new ApiResponse(500, '', 'Failed to update cohort'))
    }
    res.status(200).json(new ApiResponse(200, updatedCohort, 'Cohort updated successfully'))
  })

  listCohorts = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const cohorts = await this.cohortService.listCohorts()
    res.status(200).json(new ApiResponse(200, cohorts, 'Cohorts retrieved successfully'))
  })
  getCohortLogs = CatchAsync(async (req: IHttpRequest, res: IHttpResponse, next: NextFunction) => {
    const cohortId = req.params.id
    if (!cohortId) {
      this.logger.error('Cohort ID is required to fetch logs')
      next(new ApiError(400, 'Cohort ID is required to fetch logs'))
      return res.status(400).json(new ApiResponse(400, '', 'Cohort ID is required to fetch logs'))
    }
    const logs = await this.activityService.getLogsByEntity(EntityType.COHORT, cohortId)
    res.status(200).json(new ApiResponse(200, logs, 'Cohort logs fetched successfully'))
  })
}
