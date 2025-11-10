// model AuditLog {
//   id          String       @id @default(cuid())
//   entityType  EntityType   @default(USER)
//   entityId    String
//   action      String
//   message     String
//   userId      String
//   timestamp   DateTime     @default(now())
//   metaData    Json?

//   // Relations
//   actor       Users        @relation(fields: [userId], references: [id])
//   group       Groups?      @relation(fields: [entityId], references: [id])
// }

export enum EntityType {
  USER = 'USER',
  GROUP = 'GROUP',
  APPLICATION = 'APPLICATION',
  COHORT = 'COHORT',
}

export enum Actions {
  CREATE = 'CREATE',
  JOIN_REQUEST = 'JOIN_REQUEST',
  APPROVE = 'APPROVE',
  DECLINE = 'DECLINE',
  WITHDRAW = 'WITHDRAW',
  LEAVE = 'LEAVE',
  KICK = 'KICK',
  DISBAND = 'DISBAND',
  POST_NOTICE = 'POST_NOTICE',
}

export interface AuditLogEntity {
  id?: String
  entityType: EntityType
  entityId?: String
  action: String
  message: String
  userId: String
  timestamp: Date
  metaData?: JSON
  actor?: any[]
  group?: any[]
}

export interface IAuditLogRepository {
  logAction(auditLog: AuditLogEntity): Promise<void>
  getLogsByEntity(entityType: EntityType, entityId: String): Promise<AuditLogEntity[]>
  getLogsByUser(userId: String): Promise<AuditLogEntity[]>
  getLogsByAction(action: Actions): Promise<AuditLogEntity[]>
  getAllLogs(): Promise<AuditLogEntity[]>
}
