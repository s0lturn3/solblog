/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { CommentEntity } from 'src/features/comments/entities/comment.entity';
import { PostEntity } from "src/features/posts/entities/post.entity";
import { UserRole } from "src/shared/models/dtos/user.dto";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {

  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'E-mail of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @ApiProperty({ description: 'Hashed password of the user' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  hashed_password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.READER })
  @ApiProperty({ description: 'Role of the user in the system' })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ unique: true })
  @ApiProperty({ description: 'Unique username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @ApiProperty({ description: 'Date and time when the user was created' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @ApiProperty({ description: 'Date and time of the last update' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updated_at?: Date;


  // RELATIONS
  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];


  // LIFECYCLE HOOKS
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.hashed_password) {
      this.hashed_password = await bcrypt.hash(this.hashed_password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.hashed_password && !this.hashed_password.startsWith('$2b$')) {
      this.hashed_password = await bcrypt.hash(this.hashed_password, 10);
    }
  }


  // UTILS
  async comparePassword(plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, this.hashed_password);
  }

}
