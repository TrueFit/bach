import {useMemo} from 'react';
import {PROPS} from '../util/constants';
import generateConditionCode from '../util/generateConditionCode';

export default (memoValueName, fn, conditions) => ({generateNewVariable}) => {
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
    props: [memoValueName],
  };
};
