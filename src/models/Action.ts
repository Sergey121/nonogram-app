export type Action<T = any> = {
  type: string;
  payload: T;
};
