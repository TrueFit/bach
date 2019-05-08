const CHARACTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'];
const LENGTH = 16;

const distributed = new Set();

const newVariable = () => {
  const variable = [...Array(LENGTH)]
    .map(() => CHARACTERS[(Math.random() * CHARACTERS.length) | 0])
    .join(``);

  return distributed.has(variable)
    ? newVariable()
    : (distributed.add(variable), variable);
};

export default newVariable;
