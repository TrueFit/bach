import {REACT} from '../util/constants';

export default (reducerName, reducer, initialValue, init) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const reducerDispatch = `${reducerName}Dispatch`;
  const reducerAlias = generateNewVariable();
  const initialValueAlias = generateNewVariable();
  const initAlias = generateNewVariable();

  return {
    dependencies: {
      ...globalDependencies,
      [reducerAlias]: reducer,
      [initialValueAlias]: initialValue,
      [initAlias]: init,
    },
    initialize: `
      const [${reducerName}, ${reducerDispatch}] = ${REACT}.useReducer(${reducerAlias}, ${initialValueAlias}, ${initAlias});
    `,
    props: [reducerName, reducerDispatch],
  };
};
