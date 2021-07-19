export * from "./constant";
export * from "./createToken";
export * from "./indexable";

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const notNull = (value: any) => {
  if (!value || value == undefined || value == null) {
    throw new Error("Empty value");
  }

  return value;
};
