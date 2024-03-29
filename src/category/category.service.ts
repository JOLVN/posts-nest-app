import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryEntity } from './entities/category.entity'

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) { }

  async create(data: CreateCategoryDto) {
    return await this.categoryRepository.save(data)
  }

  async findAll() {
    return await this.categoryRepository.find()
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOneBy({ id })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const categoryUpdate = { ...category, ...updateCategoryDto }

    await this.categoryRepository.save(categoryUpdate)

    return categoryUpdate
  }

  async softRemove(id: number) {
    return await this.categoryRepository.softDelete(id)
  }
}
