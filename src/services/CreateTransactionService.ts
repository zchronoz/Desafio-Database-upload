import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    let actualCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Does not have balance to this outcome');
      }
    }

    if (!actualCategory) {
      actualCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(actualCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: actualCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
