import {useMemo} from 'react';
import {PROPS} from '../constants';
import {generateConditionCode} from '../util';
import {EnhancerContext, EnhancerResult, DependencyList} from '../types';

export default <T>(
  memoValueName: keyof T,
  fn: (t?: T) => unknown,
  conditions?: DependencyList<T>,
) => ({generateNewVariable}: EnhancerContext): EnhancerResult => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      useMemo,
      [fnName]: fn,
    },
    initialize: `const ${memoValueName} = useMemo(function () {
        return ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [memoValueName as string],
  };
};
