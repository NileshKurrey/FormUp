import { Cohorts } from '../entities/Cohorts.js'
export interface ICohortRepository {
  createCohort(cohortData: any): Promise<Cohorts>
  getCohortById(cohortId: string): Promise<Cohorts | null>
  updateCohort(cohortId: string, updateData: any): Promise<Cohorts | null>
  deleteCohort(cohortId: string): Promise<void>
  listCohorts(): Promise<Cohorts[]>
  seedData(data: any): Promise<any>
  addStudentToCohort(cohortId: string, studentId: string): Promise<any>
}
