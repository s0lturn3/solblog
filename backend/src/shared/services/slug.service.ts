/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class SlugService {
  
  /**
   * Gera um slug URL-friendly com base em uma string.
   * @param text Texto que será convertido
  */
  public generateBaseSlug(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  /**
   * Garante que o slug gerado seja único dentro do repositório.
   * Se houver conflito, adiciona um sufixo numérico (por exemplo: '-2', '-3', etc)
   * 
   * @param text Texto que será convertido
   * @param field Referência da coluna que armazena o valor do slug
   * @param repo Repositório TypeORM destino
  */
  public async generateUniqueSlug<T extends ObjectLiteral>(repo: Repository<T>, field: keyof T, text: string): Promise<string> {
    const baseSlug = this.generateBaseSlug(text);
    let slug = baseSlug;
    let counter = 1;

    while (await repo.exists({ where: { [field]: slug } as any })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }
}
