import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';
import newVariable from '../util/newVariable';

export default (fn = CONSUMER) => {
  const fnName = newVariable();

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
