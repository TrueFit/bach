import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';
import generateConditionCode from '../util/generateConditionCode';

export default (fn = CONSUMER, conditions) => ({generateNewVariable}) => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      [REACT]: React,
      [fnName]: fn,
    },
    initialize: `${REACT}.useLayoutEffect(function () {
        return ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [fnName],
  };
};
