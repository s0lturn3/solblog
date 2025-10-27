import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from "class-validator";
import { PostEntity } from "src/features/posts/entities/post.entity";
import { UserEntity } from "src/features/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class CommentEntity {

  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  @IsInt()
  @Type(() => Number)
  post_id: number;
  
  @Column({ nullable: true })
  author_id?: string;

  @Column()
  @IsString()
  body: string;
  
  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  created_at: Date;
  
  @UpdateDateColumn()
  @IsDate()
  @Type(() => Date)
  updated_at: Date;
  
  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  @IsDate()
  @Type(() => Date)
  deleted_at?: Date;

  @Column({ default: false })
  @IsBoolean()
  is_approved: boolean;
  
  @Column({ nullable: true })
  @IsOptional()
  parent_id?: string;


  // RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;


  // LIFECYCLE HOOKS
  @BeforeInsert()
  updateCreationDate() {
    if (!this.created_at) this.created_at = new Date();
  }
  
  @BeforeUpdate()
  updateChangeDate() {
    if (!this.updated_at) this.updated_at = new Date();
  }

}
