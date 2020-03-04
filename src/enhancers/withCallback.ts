import {useCallback} from 'react';
import {EnhancerContext, EnhancerResult, DependencyList} from '../types';
import {PROPS} from '../constants';
import {generateConditionCode} from '../util';

export default <T>(
  callbackName: keyof T,
  fn: (t: T) => () => void,
  conditions?: DependencyList<T>,
) => ({generateNewVariable}: EnhancerContext): EnhancerResult => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      useCallback,
      [fnName]: fn,
    },
    initialize: `const ${callbackName} = useCallback(${fnName}(${PROPS}), [${conditionCode}]);`,
    props: [callbackName as string],
  };
};
