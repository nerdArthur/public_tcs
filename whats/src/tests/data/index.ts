import { insertUsers } from "./users";
import { Indexable } from "../../utils/indexable";

export const useData = async (entities: string[]) => {
  const data: Indexable = {
    user: (async () => await insertUsers())(),
  };

  for (let i = 0; i < entities.length; i++) {
    await data[entities[i]];
  }
};
