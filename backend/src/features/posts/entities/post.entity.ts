import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "src/features/users/entities/user.entity";
import { PostStatus } from "src/shared/models/dtos/post.dto";
import { SlugService } from "src/shared/services/slug.service";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DataSource, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @Column('text')
  @IsString()
  @IsNotEmpty()
  body_markdown: string;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  rendered_html?: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  status: PostStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  updated_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  @IsDate()
  published_at?: Date;

  @Column({ default: false })
  @IsBoolean()
  is_private: boolean;

  @Column({ type: 'uuid' })
  @IsUUID()
  author_id: string;


  // RELATIONS
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;


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
      const repo = Post.dataSource.getRepository(Post);
      this.slug = await Post.slugService.generateUniqueSlug(repo, 'slug', this.title);
    }

    if (this.status === PostStatus.PUBLISHED && !this.published_at) {
      this.published_at = new Date();
    }
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (!this.slug && this.title) {
      const repo = Post.dataSource.getRepository(Post);
      this.slug = await Post.slugService.generateUniqueSlug(repo, 'slug', this.title);
    }

    if (this.status === PostStatus.PUBLISHED && !this.published_at) {
      this.published_at = new Date();
    }
  }

}
