/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Post } from "src/features/posts/entities/post.entity";
import { UserRole } from "src/shared/models/dtos/user.dto";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Usa '{ select: false }' — isso garante que o TypeORM não vai trazer esta coluna a não ser que seja especificada explicitamente
  @Column({ select: false })
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  hashed_password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.READER })
  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ unique: true })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @ApiProperty()
  @IsOptional()
  @IsDate()
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @ApiProperty()
  @IsOptional()
  @IsDate()
  updated_at?: Date;


  // RELATIONS
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];


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
