import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';
import generateConditionCode from '../util/generateConditionCode';

export default (callbackName, fn = CONSUMER, conditions) => ({
  generateNewVariable,
}) => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      [REACT]: React,
      [fnName]: fn,
    },
    initialize: `const ${callbackName} = ${REACT}.useCallback(function () {
        ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [callbackName],
  };
};
