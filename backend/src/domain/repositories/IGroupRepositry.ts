import { Group, Applications } from '../entities/Groups.js'
export interface IGroupRepository {
  create(group: Group): Promise<Group>
  update(group: Group): Promise<Group>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Group | null>
  findAll(): Promise<Group[]>
  findByCohortId(cohortId: string): Promise<Group[]>
  addMember(groupId: string, userId: string): Promise<Group>
  removeMember(groupId: string, userId: string): Promise<Group>
  seeMembers(groupId: string): Promise<Object>
  getGroupWithCurrentCohort(cohortId: string): Promise<Group[]>
}

export interface IApplicationsRepository {
  sendApplication(application: Applications): Promise<Applications>
  updateApplication(application: Applications): Promise<Applications>
  listUserApplications(userId: string): Promise<Applications[]>
  applicationById(applicationId: string): Promise<Applications | null>
  withdrawApplication(applicationId: string): Promise<Applications>
  listGroupApplications(groupId: string): Promise<Applications[]>
  approveApplication(applicationId: string): Promise<Applications>
  rejectApplication(applicationId: string): Promise<Applications>
  rejectedApplications(groupId: string): Promise<Applications[]>
  approvedApplications(groupId: string): Promise<Applications[]>
  pendingApplications(groupId: string): Promise<Applications[]>
}
