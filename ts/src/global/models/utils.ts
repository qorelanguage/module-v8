export type StrictRecord<K extends keyof any, T> = {
  [P in K]: T;
};
