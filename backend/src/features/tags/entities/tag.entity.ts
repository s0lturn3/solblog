import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PostEntity } from "src/features/posts/entities/post.entity";
import { SlugService } from "src/shared/services/slug.service";
import { BeforeInsert, BeforeUpdate, Column, DataSource, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class TagEntity {

  @ApiProperty({ description: 'Autoincrement ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the tag' })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ description: 'URL-friendly version of the tag name' })
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  slug: string;


  // RELATIONS
  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: PostEntity[];


  // LIFECYCLE HOOKS
  private static slugService: SlugService;
  private static dataSource: DataSource;

  static configure(slugService: SlugService, dataSource: DataSource) {
    this.slugService = slugService;
    this.dataSource = dataSource;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async beforeSave() {
    if (!this.slug && this.name) {
      const repo = TagEntity.dataSource.getRepository(TagEntity);
      this.slug = await TagEntity.slugService.generateUniqueSlug(repo, 'slug', this.name);
    }
  }

}
