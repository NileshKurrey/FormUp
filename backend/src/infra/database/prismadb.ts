import { email } from 'zod'
import type { IDatabaseRepository } from '../../domain/repositories/IDatabaseRepostry.js'
import type { PrismaClient } from '../../generated/prisma/client.js'
import { db } from './db.js'
export class PrismaDb implements IDatabaseRepository {
  private prisma

  constructor() {
    this.prisma = db
  }

  private getModel(model: string): any {
    const selectedModel = model
    const modelMap: { [key: string]: any } = {
      users: this.prisma.users,
      cohorts: this.prisma.cohorts,
      groups: this.prisma.groups,
      applications: this.prisma.applications,
      post: this.prisma.post,
      auditlog: this.prisma.auditLog,
      seeddata: this.prisma.seedData,
      seedStudentEmail: this.prisma.seedStudent,
    }

    const selected = modelMap[selectedModel]
    if (!selected) throw new Error(`Invalid model name: ${model}`)
    return selected
  }

  async findById(model: string, id: string): Promise<any> {
    const m = this.getModel(model)
    return await m.findUnique({ where: { id } })
  }

  async findAll(model: string): Promise<any[]> {
    const m = this.getModel(model)
    return await m.findMany()
  }

  async create(model: string, data: any): Promise<any> {
    const m = this.getModel(model)
    return await m.create({ data })
  }

  async updateById(model: string, data: any): Promise<any> {
    const m = this.getModel(model)
    const { id, ...updateData } = data
    return await m.update({
      where: { id },
      data: updateData,
    })
  }

  async deleteById(model: string, id: string): Promise<void> {
    const m = this.getModel(model)
    await m.delete({ where: { id } })
  }
  async updateMany(model: string, data: any): Promise<any[]> {
    const m = this.getModel(model)
    const updatePromises = data.map((item: any) => {
      const { id, ...updateData } = item
      return m.update({
        where: { id },
        data: updateData,
      })
    })

    return await Promise.all(updatePromises)
  }

  async findOne(model: string, query: any): Promise<any> {
    const m = this.getModel(model)
    console.log('query in findOne:', model, query)
    return await m.findFirst(query)
  }
  async findMany(model: string, query: any): Promise<any[]> {
    const m = this.getModel(model)
    return await m.findMany({ where: query })
  }
  async findByIdandUpdate(model: string, id: string, updateData: any): Promise<any> {
    const m = this.getModel(model)
    return await m.update({
      where: { id },
      data: updateData,
    })
  }
}
