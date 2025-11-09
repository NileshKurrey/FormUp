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
  USER,
  GROUP,
  APPLICATION,
  COHORT,
}

export enum Actions {
  CREATE,
  JOIN_REQUEST,
  APPROVE,
  DECLINE,
  WITHDRAW,
  LEAVE,
  KICK,
  DISBAND,
  POST_NOTICE,
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
}

export interface IAuditLogRepository {
  logAction(auditLog: AuditLogEntity): Promise<void>
  getLogsByEntity(entityType: EntityType, entityId: String): Promise<AuditLogEntity[]>
  getLogsByUser(userId: String): Promise<AuditLogEntity[]>
  getLogsByAction(action: Actions): Promise<AuditLogEntity[]>
  getAllLogs(): Promise<AuditLogEntity[]>
}
