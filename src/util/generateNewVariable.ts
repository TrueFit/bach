/* eslint-disable no-bitwise */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const CHARACTERS: string[] = [...'_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
const LENGTH = 16;

const generate = (): string =>
  [...Array(LENGTH)].map(() => CHARACTERS[(Math.random() * CHARACTERS.length) | 0]).join('');

const generateUnique = (distributed: Set<string>): string => {
  const variable = generate();

  return distributed.has(variable)
    ? generateUnique(distributed)
    : (distributed.add(variable), variable);
};

export default (): (() => string) => {
  const distributed = new Set<string>();

  return (): string => generateUnique(distributed);
};
