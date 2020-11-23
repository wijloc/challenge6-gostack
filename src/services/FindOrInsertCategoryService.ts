import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class FindOrInsertCategory {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title },
    });

    if (category) {
      return category;
    }
    const categoryToInsert = categoryRepository.create({
      title,
    });

    await categoryRepository.save(categoryToInsert);

    return categoryToInsert;
  }
}

export default FindOrInsertCategory;
