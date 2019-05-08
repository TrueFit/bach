import _ from 'lodash';
import React from 'react';
import {REACT, PROPS} from '../util/constants';

export default (map = {}) => {
  const keys = _.keys(map);
  const functions = keys.map(
    key =>
      `const ${key} = ${REACT}.useCallback(function () {
        const fn = ${map[key].toString()};
        fn(${PROPS});
      }, [${PROPS}]);`,
  );

  return {
    dependencies: {
      [REACT]: React,
    },
    initialize: functions.join('\n'),
    props: keys,
  };
};
