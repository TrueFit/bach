import {useReducer, Reducer} from 'react';
import {EnhancerContext, EnhancerResult} from '../types';

export default <T, S, A>(
  reducerName: keyof T,
  reducer: Reducer<S, A>,
  initialValue: S,
  init?: (v: S | undefined) => S,
) => ({generateNewVariable}: EnhancerContext): EnhancerResult => {
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
    props: [reducerName as string, reducerDispatch],
  };
};
