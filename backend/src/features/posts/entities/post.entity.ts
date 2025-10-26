import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TagEntity } from "src/features/tags/entities/tag.entity";
import { UserEntity } from "src/features/users/entities/user.entity";
import { PostStatus } from "src/shared/models/dtos/post.dto";
import { SlugService } from "src/shared/services/slug.service";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DataSource, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class PostEntity {

  @ApiProperty({ description: 'Autoincrement ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'URL-friendly version of the post title' })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Title of the blog post' })
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Optional subtitle or description of the post' })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: 'Content of the post in Markdown format' })
  @Column('text')
  @IsString()
  @IsNotEmpty()
  body_markdown: string;

  @ApiProperty({ description: 'Content of the post converted to HTML' })
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  rendered_html?: string;

  @ApiProperty({ description: 'Current status of the post (draft, published, etc)' })
  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({ description: 'Date and time when the post was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty({ description: 'Date and time of the last update' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  @Type(() => Date)
  updated_at: Date;

  @ApiProperty({ description: 'Date and time when the post was published' })
  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  published_at?: Date;

  @ApiProperty({ description: 'Whether the post is private or public' })
  @Column({ default: false })
  @IsBoolean()
  is_private: boolean;

  @ApiProperty({ description: 'UUID of the post author' })
  @Column({ type: 'uuid' })
  @IsUUID()
  author_id: string;


  // RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'post_tags', // name of the relation table
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];


  // LIFECYCLE HOOKS
  private static slugService: SlugService;
  private static dataSource: DataSource;

  static configure(slugService: SlugService, dataSource: DataSource) {
    this.slugService = slugService;
    this.dataSource = dataSource;
  }

  @BeforeInsert()
  async beforeInsert() {
    if (!this.slug && this.title) {
      const repo = PostEntity.dataSource.getRepository(PostEntity);
      this.slug = await PostEntity.slugService.generateUniqueSlug(repo, 'slug', this.title);
    }

    if (this.status === PostStatus.PUBLISHED && !this.published_at) {
      this.published_at = new Date();
    }
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (!this.slug && this.title) {
      const repo = PostEntity.dataSource.getRepository(PostEntity);
      this.slug = await PostEntity.slugService.generateUniqueSlug(repo, 'slug', this.title);
    }

    if (this.status === PostStatus.PUBLISHED && !this.published_at) {
      this.published_at = new Date();
    }
  }

}
