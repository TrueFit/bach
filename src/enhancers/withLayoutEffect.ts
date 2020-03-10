import {useLayoutEffect} from 'react';
import {PROPS} from '../constants';
import {generateConditionCode} from '../util';
import {EnhancerContext, EnhancerResult, DependencyList} from '../types';

export default <T>(fn: (t?: T) => void | ((t?: T) => void), conditions?: DependencyList<T>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      useLayoutEffect,
      [fnName]: fn,
    },
    initialize: `useLayoutEffect(function () {
        return ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [fnName],
  };
};
