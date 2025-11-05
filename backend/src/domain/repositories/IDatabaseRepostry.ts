//General database repository interface

export interface IDatabaseRepository {
  findById(model: string, id: string): Promise<any>
  findOne(model: string, query: any): Promise<any>
  findAll(model: string): Promise<any[]>
  create(model: string, data: any): Promise<any>
  updateById(model: string, data: any): Promise<any>
  deleteById(model: string, id: string): Promise<void>
  updateMany(model: string, data: any): Promise<any[]>
  findMany(model: string, query: any): Promise<any[]>
}
