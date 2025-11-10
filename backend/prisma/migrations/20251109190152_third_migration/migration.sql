-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_entityId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "entityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_group_fkey" FOREIGN KEY ("entityId") REFERENCES "Groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_cohort_fkey" FOREIGN KEY ("entityId") REFERENCES "Cohorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_application_fkey" FOREIGN KEY ("entityId") REFERENCES "Applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
