import type { Group } from '../../domain/entities/Groups.js'
import type { IGroupRepository } from '../../domain/repositories/IGroupRepositry.js'
import { createServiceContainer } from '../../infra/di/container.js'

export class GroupService implements IGroupRepository {
  container = createServiceContainer()
  logger = this.container.logger
  database = this.container.database
  model: string = 'groups'
  postModel: string = 'post'
  async create(group: Group): Promise<Group> {
    const createdGroup = await this.database.create(this.model, group)
    return createdGroup
  }
  async update(group: Group): Promise<Group> {
    const updatedGroup = await this.database.updateById(this.model, group)
    return updatedGroup
  }
  async delete(id: string): Promise<void> {
    await this.database.deleteById(this.model, id)
  }
  async findById(id: string): Promise<Group | null> {
    const group = await this.database.findById(this.model, id)
    return group
  }
  async findAll(): Promise<Group[]> {
    const groups = await this.database.findAll(this.model)
    return groups
  }
  async findByCohortId(cohortId: string): Promise<Group[]> {
    const groups = await this.database.findMany(this.model, { cohortId: cohortId })
    return groups
  }
  async addMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    if (!group.members.includes(userId) || group.members.length < 4) {
      group.members.push(userId)
    }
    await this.database.updateById(this.model, group)
    return group
  }
  async removeMember(groupId: string, userId: string): Promise<Group> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    group.members = group.members.filter(memberId => memberId !== userId)
    await this.database.updateById(this.model, group)
    return group
  }
  async addPost(groupId: string, post: any): Promise<JSON> {
    // const createdPost = await this.database.create(this.postModel, post);
    // const group = await this.findById(groupId);
    // if (!group) {
    //     this.logger.error(`Group with ID ${groupId} not found.`);
    //     throw new Error("Group not found");
    // }
    // if (!group.posts) {
    //     group.posts = [];
    // }
    // group.posts.push(createdPost.id);
    // await this.database.updateById(this.model, group);

    // do this in future
    return {} as JSON
  }
  async seePosts(groupId: string): Promise<JSON> {
    // const group = await this.findById(groupId);
    // if (!group) {
    //     this.logger.error(`Group with ID ${groupId} not found.`);
    //     throw new Error("Group not found");
    // }

    // do this in future
    return {} as JSON
  }
  async seeMembers(groupId: string): Promise<Object> {
    const group = await this.findById(groupId)
    if (!group) {
      this.logger.error(`Group with ID ${groupId} not found.`)
      throw new Error('Group not found')
    }
    const members = group.members
    const detailedMembers: Array<any> = []
    members.map(membersId => {
      detailedMembers.push(this.database.findById('users', membersId))
    })
    return { members: detailedMembers }
  }
  async getGroupWithCurrentCohort(cohortId: string): Promise<Group[]> {
    const groups = await this.database.findMany(this.model, { cohortId: cohortId })
    return groups
  }
}
