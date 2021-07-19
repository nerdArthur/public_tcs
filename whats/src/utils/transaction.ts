import { EntityManager, getConnection } from "typeorm";

export type TransactionCallback = (em: EntityManager) => Promise<unknown>;

export const makeTransaction = async (
  transactionBlock: TransactionCallback
) => {
  await getConnection().transaction(transactionBlock);
};
