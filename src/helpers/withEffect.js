import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';

export default (fn = CONSUMER) => ({generateNewVariable}) => {
  const fnName = generateNewVariable();

  return {
    dependencies: {
      [REACT]: React,
      [fnName]: fn,
    },
    initialize: `${REACT}.useEffect(function () {
        ${fnName}(${PROPS});
      }, [${PROPS}]);`,
    props: [fnName],
  };
};
