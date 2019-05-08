import React from 'react';
import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';

export default (fn = CONSUMER) => {
  return {
    dependencies: {
      [REACT]: React,
    },
    initialize: `${REACT}.useEffect(function () {
        const fn = ${fn.toString()};
        fn(${PROPS});
      }, [${PROPS}]);`,
    props: [],
  };
};
