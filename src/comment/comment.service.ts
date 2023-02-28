import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommentEntity } from './entities/comment.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) { }

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save(createCommentDto)
  }

  async findAll() {
    return await this.commentRepository.find()
  }

  async findOneById(id: number) {
    return await this.commentRepository.findOneBy({ id })
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOneById(id)

    if (!comment) {
      throw new NotFoundException('comment not found')
    }

    const commentUpdate = { ...comment, ...updateCommentDto }

    await this.commentRepository.save(commentUpdate)

    return commentUpdate
  }

  async softRemove(id: number) {
    return await this.commentRepository.softDelete(id)
  }
}
