import {useCallback} from 'react';
import {PROPS} from '../util/constants';
import generateConditionCode from '../util/generateConditionCode';

export default (callbackName, fn, conditions) => ({generateNewVariable}) => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      useCallback,
      [fnName]: fn,
    },
    initialize: `const ${callbackName} = useCallback(${fnName}(${PROPS}), [${conditionCode}]);`,
    props: [callbackName],
  };
};
