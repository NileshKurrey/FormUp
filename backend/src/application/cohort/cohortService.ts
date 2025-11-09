import type { Cohorts } from '../../domain/entities/Cohorts.js'
import {
  Actions,
  EntityType,
  type AuditLogEntity,
  type IAuditLogRepository,
} from '../../domain/repositories/IActivityRepositery.js'
import type { ICohortRepository } from '../../domain/repositories/ICohortRepositry.js'
import type { IDatabaseRepository } from '../../domain/repositories/IDatabaseRepostry.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'
import { ActivityService } from '../activity/activity.js'

export class CohortService implements ICohortRepository {
  private container: ServiceContainer
  private logger: ILoggerRepository
  private activityService: IAuditLogRepository
  private model: string = 'cohorts'
  private database: IDatabaseRepository
  constructor() {
    this.container = createServiceContainer()
    this.logger = this.container.logger
    this.database = this.container.database
    this.activityService = new ActivityService()
  }
  async createCohort(cohortData: any): Promise<Cohorts> {
    const createdCohort = await this.database.create(this.model, cohortData)
    const logAction: AuditLogEntity = {
      entityType: EntityType.COHORT,
      action: Actions.CREATE.toString(),
      entityId: createdCohort.id,
      message: `Cohort created successfully`,
      userId: createdCohort.createdBy,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return createdCohort
  }
  async getCohortById(cohortId: string): Promise<Cohorts | null> {
    const cohort = await this.database.findOne(this.model, { where: { id: cohortId }, include: { SeedData: true } })
    this.logger.debug(`Fetched cohort: ${JSON.stringify(cohort?.SeedData)}`)
    return cohort
  }
  async updateCohort(cohortId: string, updateData: any): Promise<Cohorts | null> {
    const updatedCohort = await this.database.findByIdandUpdate(this.model, cohortId, updateData)
    const logAction: AuditLogEntity = {
      entityType: EntityType.COHORT,
      action: Actions.CREATE.toString(),
      entityId: updatedCohort.id,
      message: `Cohort updated successfully`,
      userId: updatedCohort.updatedBy,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
    return updatedCohort
  }
  async deleteCohort(cohortId: string): Promise<void> {
    await this.database.deleteById(this.model, cohortId)
    const logAction: AuditLogEntity = {
      entityType: EntityType.COHORT,
      action: Actions.DISBAND.toString(),
      entityId: cohortId,
      message: `Cohort disbanded successfully`,
      userId: cohortId,
      timestamp: new Date(),
    }
    this.activityService.logAction(logAction)
  }
  async listCohorts(): Promise<Cohorts[]> {
    const cohorts = await this.database.findAll(this.model)
    return cohorts
  }
  async seedData(data: any): Promise<any> {
    //implement seed data logic in future
  }
  async addStudentToCohort(cohortId: string, studentId: string): Promise<any> {
    //implement add student to cohort logic in future
  }
}
