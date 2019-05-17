import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';
import generateConditionCode from '../util/generateConditionCode';

export default (memoValueName, fn = CONSUMER, conditions) => ({
  generateNewVariable,
}) => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      [REACT]: React,
      [fnName]: fn,
    },
    initialize: `const ${memoValueName} = ${REACT}.useMemo(function () {
        return ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [memoValueName],
  };
};
