import { nanoid } from 'nanoid';

export const generateId = (): string => {
  return nanoid(16); // 16 characters long, which gives us a good balance of uniqueness and length
};
