import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostCreateDto } from './entity/post-create.dto'
import { PostEntity } from './entity/post.entity'
import { PostUpdateDto } from './entity/post-update.dto'

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) { }

    async getAllPosts(queries) {

        let limit = queries.limit
        const { published, categories } = queries

        limit = limit ? parseInt(limit) : 10

        const query = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'categories')


        if (published !== undefined) {
            query
                .andWhere('post.published = :published', { published })
        }

        if (categories !== undefined) {
            query
                .andWhere('categories.name IN (:...categories)', { categories: categories.split(',') })
        }

        const postList = query
            .limit(limit)
            .getMany()

        return postList
    }

    async getPostById(id: number) {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.categories', 'categories')
            .orderBy('post.createdAt', 'DESC')
            .where('post.id = :id', { id })
            .getOne()

        return post
    }

    async createPost(data: PostCreateDto) {
        try {
            return await this.postRepository.save(data)

        }
        catch (error) {
            throw new Error('Error while creating post')
        }
    }

    async updatePost(id: number, data: PostUpdateDto) {
        const post = await this.postRepository.findOneBy({ id })
        const postUpdate = { ...post, ...data }
        await this.postRepository.save(postUpdate)
    }

    softDeletePost(id: number) {
        try {
            return this.postRepository.softDelete(id)
        }
        catch (error) {
            throw new Error('Error while deleting post')
        }
    }
}
