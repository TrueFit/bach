import {useReducer} from 'react';

export default (reducerName, reducer, initialValue, init) => ({
  generateNewVariable,
}) => {
  const reducerDispatch = `${reducerName}Dispatch`;
  const reducerValue = generateNewVariable();
  const reducerAlias = generateNewVariable();

  const initialValueAlias = generateNewVariable();
  const initAlias = generateNewVariable();

  return {
    dependencies: {
      useReducer,
      [reducerAlias]: reducer,
      [initialValueAlias]: initialValue,
      [initAlias]: init,
    },
    initialize: `
      const ${reducerValue} = useReducer(${reducerAlias}, ${initialValueAlias}, ${initAlias});
      const ${reducerName} = ${reducerValue}[0];
      const ${reducerDispatch} = ${reducerValue}[1];
    `,
    props: [reducerName, reducerDispatch],
  };
};
