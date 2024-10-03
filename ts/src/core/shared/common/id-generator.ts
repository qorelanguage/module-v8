import { Static, Type } from '@sinclair/typebox';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 21;

export const ApId = Type.String({
  pattern: `^[0-9a-zA-Z]{${ID_LENGTH}}$`,
});

export type ApId = Static<typeof ApId>;

const generateRandomId = (alphabet: string, length: number): string => {
  let id = '';
  const charactersLength = alphabet.length;
  for (let i = 0; i < length; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * charactersLength));
  }

  return id;
};

export const apId = () => generateRandomId(ALPHABET, ID_LENGTH);

export const secureApId = (length: number) => generateRandomId(ALPHABET, length);
