import { FindOneOptions, Repository, Entity } from "typeorm";
import { Request } from "express";
import { Indexable } from "./indexable";

export interface PaginationOptions {
  take?: number;
  skip?: number;
  order?: FindOneOptions["order"];
  where?: FindOneOptions["where"];
}

export interface Pagination {
  data: Indexable[];
  page: number;
  totalCount: number;
}

const filterNotNullEntries = (obj: Indexable) => {
  const KEY = 0;
  const VALUE = 1;

  const notNullEntries = Object.entries(obj).filter(
    (arr) => arr[VALUE] !== undefined
  );

  return notNullEntries.map((entry) =>
    Object.defineProperty({}, entry[KEY], {
      value: entry[VALUE],
      configurable: true,
      enumerable: true,
      writable: true,
    })
  );
};

export const buildPagination = async <T>(
  req: Request,
  entityRepository: Repository<T>,
  options?: PaginationOptions
) => {
  const { page = 0, pageSize = 50 } = req.params;

  const query = { take: pageSize, skip: page, ...options };

  const resultQuery = filterNotNullEntries(query).reduce(
    (previous, current) => ({
      ...previous,
      ...current,
    })
  );

  const resultEntities = await entityRepository.find(resultQuery);
  const totalCount = await entityRepository.count(resultQuery);

  const paginationResult: Pagination = {
    data: resultEntities,
    page: Number(page),
    totalCount,
  };

  return paginationResult;
};
