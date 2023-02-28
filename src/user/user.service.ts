import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAll() {
    return await this.userRepository.find()
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto)
    user.password = await bcrypt.hash(user.password, 10)
    return user
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id)

    if (!user) {
      throw new NotFoundException('user not found')
    }

    const userUpdate = { ...user, ...updateUserDto }

    await this.userRepository.save(userUpdate)

    return userUpdate
  }

  async softRemove(id: number) {
    return await this.userRepository.softDelete(id)
  }
}
