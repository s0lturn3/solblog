/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import slugify from 'slugify';
import { ObjectLiteral, Repository } from 'typeorm';

/** Classe auxiliar com métodos utilitários referentes aos Slugs dos posts. */
export class SlugUtils {

  /**
   * Gera um slug URL-friendly com base em uma string.
   * @param text Texto que será convertido
  */
  public static generateBaseSlug(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true, // removes special chars like "!" or "?"
      trim: true,
    });
  }

  /**
   * Garante que o slug gerado seja único dentro do repositório.
   * Se houver conflito, adiciona um sufixo numérico (por exemplo: '-2', '-3', etc)
   * 
   * @param baseText Texto que será convertido
   * @param entityField Referência da coluna que armazena o valor do slug
   * @param repo Repositório TypeORM destino
  */
  public static async generateUniqueSlug<T extends ObjectLiteral>(repo: Repository<T>, entityField: keyof T, baseText: string): Promise<string> {
    const baseSlug = this.generateBaseSlug(baseText);
    let slug = baseSlug;
    let counter = 1;

    while (await repo.exists({ where: { [entityField]: slug } as any })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }
}
