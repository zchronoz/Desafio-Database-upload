import { isUuid } from 'uuidv4';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new AppError('Invalid Id.', 401);
    }
    const repositoryTransactions = getRepository(Transaction);
    const transaction = await repositoryTransactions.findOne(id);

    if (!transaction) {
      throw new AppError('Invalid Id', 401);
    }

    await repositoryTransactions.delete(id);
  }
}

export default DeleteTransactionService;
