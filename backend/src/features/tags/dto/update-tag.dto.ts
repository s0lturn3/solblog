import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {

  @ApiProperty({ description: 'Name of the tag' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ required: false, description: 'URL-friendly version of the tag name' })
  @IsString()
  @IsOptional()
  slug?: string;

}
