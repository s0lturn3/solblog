import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PostStatus } from "src/shared/models/dtos/post.dto";

export class CreatePostDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body_markdown: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rendered_html?: string;

  @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({ required: false, default: new Date() })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  created_at?: Date;

  @ApiProperty({ default: null, required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  published_at?: Date;

  @ApiProperty()
  @IsBoolean()
  is_private: boolean;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  author_id: string;


  @ApiProperty({ required: false, description: 'Tags associated with the post', type: [ String ] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

}
