import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import FindOrInsertCategoryService from './FindOrInsertCategoryService';

interface Request {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category_title: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const findOrInsertCategory = new FindOrInsertCategoryService();

    const category = await findOrInsertCategory.execute({
      title: category_title,
    });

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
