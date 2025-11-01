import type { LoginDTO } from '../../infra/auth/LoginDto.js'
import type { Users as UserEntity } from '../../domain/entities/Users.js'
import type { IAuthRepository } from '../../domain/repositories/IAuthRepositry.js'
import type { IDatabaseRepository } from '../../domain/repositories/IDatabaseRepostry.js'
import type { ILoggerRepository } from '../../domain/repositories/IloggerRepositry.js'
import type { IUserRepository } from '../../domain/repositories/IUserRepostiry.js'
import { GoogleAuth } from '../../infra/auth/googleAuth.js'
import { createServiceContainer } from '../../infra/di/container.js'

export class UserService implements IUserRepository {
  googleAuth: IAuthRepository
  container = createServiceContainer()
  logger: ILoggerRepository = this.container.logger
  database: IDatabaseRepository = this.container.database
  model: string = 'users'
  constructor() {
    this.googleAuth = new GoogleAuth()
  }
  login(oidcType: string, state: string, nonce: string): string {
    if (oidcType === 'google') {
      return this.googleAuth.login(state, nonce)
    } else {
      this.logger.error(`Unsupported OIDC type: ${oidcType}`)
      throw new Error(`Unsupported OIDC type: ${oidcType}`)
    }
  }

  async callback(
    oidcType: string,
    code: string,
    state: string,
    savednonce: string,
    savedstate: string
  ): Promise<{ token: LoginDTO; status: number }> {
    if (oidcType === 'google') {
      return this.googleAuth.handleCallback(code, state, savednonce, savedstate)
    } else {
      this.logger.error(`Unsupported OIDC type: ${oidcType}`)
      throw new Error(`Unsupported OIDC type: ${oidcType}`)
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.database.findById(this.model, id)
    return user
  }
  async findByEmail(email: string): Promise<boolean> {
    const user = await this.database.findOne('seedStudentEmail', { email: email })
    return user !== null
  }
  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.database.create(this.model, user)
    return createdUser
  }
  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.database.updateById(this.model, user)
    return updatedUser
  }
  async delete(id: string): Promise<void> {
    await this.database.deleteById(this.model, id)
  }
  async findAll(): Promise<UserEntity[]> {
    const users = await this.database.findAll(this.model)
    return users
  }
  async findUser(oidcId: string): Promise<UserEntity | null> {
    const user = await this.database.findOne(this.model, { oidcId })
    return user
  }
}
