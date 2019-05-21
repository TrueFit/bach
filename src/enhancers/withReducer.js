import {useReducer} from 'react';

export default (reducerName, reducer, initialValue, init) => ({
  generateNewVariable,
}) => {
  const reducerDispatch = `${reducerName}Dispatch`;
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
      const [${reducerName}, ${reducerDispatch}] = useReducer(${reducerAlias}, ${initialValueAlias}, ${initAlias});
    `,
    props: [reducerName, reducerDispatch],
  };
};
