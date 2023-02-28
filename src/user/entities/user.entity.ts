import { CommentEntity } from "src/comment/entities/comment.entity"
import { Timestamp } from "src/Generic/timestamp.entity"
import { PostEntity } from "src/post/entity/post.entity"
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm"

export class UserEntity extends Timestamp {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    fistname: string

    @Column({
        nullable: false
    })
    lastname: string

    @Column({
        nullable: false,
        unique: true
    })
    email: string

    @Column({
        nullable: false
    })
    password: string

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[]

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[]

}
