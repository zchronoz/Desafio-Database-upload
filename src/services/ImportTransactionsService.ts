import path from 'path';
import csv from 'csvtojson';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  fileName: string;
}

interface RequestTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, fileName);
    const createTransaction = new CreateTransactionService();

    const transactions = await csv().fromFile(filePath);

    async function processArray(
      transactionsArray: RequestTransaction[],
    ): Promise<void> {
      for (const transaction of transactionsArray) {
        const { title, type, value, category } = transaction;

        await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }
    }

    await processArray(transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
