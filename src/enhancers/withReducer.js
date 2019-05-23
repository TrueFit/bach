import {useReducer} from 'react';
import generateAssignments from '../util/generateAssignments.js';

export default (reducerName, reducer, initialValue, init) => ({
  generateNewVariable,
}) => {
  const reducerDispatch = `${reducerName}Dispatch`;
  const reducerAlias = generateNewVariable();
  const initialValueAlias = generateNewVariable();
  const initAlias = generateNewVariable();

  const reducerValue = `${reducerName}Value`;
  const assignments = generateAssignments(
    [reducerName, reducerDispatch],
    reducerValue,
  );

  return {
    dependencies: {
      useReducer,
      [reducerAlias]: reducer,
      [initialValueAlias]: initialValue,
      [initAlias]: init,
    },
    initialize: `
      const ${reducerValue} = useReducer(${reducerAlias}, ${initialValueAlias}, ${initAlias});
      ${assignments}
    `,
    props: [reducerName, reducerDispatch],
  };
};
