import type { AuditLogEntity, IAuditLogRepository } from '../../domain/repositories/IActivityRepositery.js'
import type { IDatabaseRepository } from '../../domain/repositories/IDatabaseRepostry.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import { createServiceContainer, type ServiceContainer } from '../../infra/di/container.js'

export class ActivityService implements IAuditLogRepository {
  private container: ServiceContainer
  private database: IDatabaseRepository
  private logger: ILoggerRepository
  private model: string
  constructor() {
    this.container = createServiceContainer()
    this.database = this.container.database
    this.logger = this.container.logger
    this.model = 'auditlog'
  }
  async logAction(auditLog: AuditLogEntity): Promise<void> {
    this.logger.info(
      `Logging action: ${auditLog.action} for entity: ${auditLog.entityType} by user: ${auditLog.userId}`
    )
    await this.database.create(this.model, auditLog)
  }
  async getLogsByEntity(entityType: string, entityId: String): Promise<AuditLogEntity[]> {
    const logs = await this.database.findMany(this.model, {
      entityType: entityType,
      entityId: entityId,
      include: { group: true, actor: true },
    })
    return logs
  }
  async getLogsByUser(userId: String): Promise<AuditLogEntity[]> {
    const logs = await this.database.findMany(this.model, { userId: userId, include: { actor: true } })
    return logs
  }
  async getLogsByAction(action: string): Promise<AuditLogEntity[]> {
    const logs = await this.database.findMany(this.model, { action: action, include: { group: true, actor: true } })
    return logs
  }
  async getAllLogs(): Promise<AuditLogEntity[]> {
    const logs = await this.database.findAll(this.model)
    return logs
  }
  async deleteUserLogs(userId: string): Promise<void> {
    await this.database.deleteById(this.model, userId)
  }
}
