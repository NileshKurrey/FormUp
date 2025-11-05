import { Group } from '../entities/Groups.js'
export interface IGroupRepository {
  create(group: Group): Promise<Group>
  update(group: Group): Promise<Group>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Group | null>
  findAll(): Promise<Group[]>
  findByCohortId(cohortId: string): Promise<Group[]>
  addMember(groupId: string, userId: string): Promise<Group>
  removeMember(groupId: string, userId: string): Promise<Group>
  addPost(groupId: string, post: any): Promise<JSON>
  seePosts(groupId: string): Promise<JSON>
  seeMembers(groupId: string): Promise<Object>
  getGroupWithCurrentCohort(cohortId: string): Promise<Group[]>
}
