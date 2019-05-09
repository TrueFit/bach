const CHARACTERS = [...'_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
const LENGTH = 16;

const generate = () =>
  [...Array(LENGTH)]
    .map(() => CHARACTERS[(Math.random() * CHARACTERS.length) | 0])
    .join('');

const generateUnique = distributed => {
  const variable = generate();

  return distributed.has(variable)
    ? generateUnique(distributed)
    : (distributed.add(variable), variable);
};

export default () => {
  const distributed = new Set();

  return () => generateUnique(distributed);
};
