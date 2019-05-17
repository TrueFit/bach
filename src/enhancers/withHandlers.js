import React from 'react';
import {REACT, PROPS} from '../util/constants';

export default (map = {}) => ({generateNewVariable}) => {
  const handles = Object.keys(map).reduce(
    (result, key) => {
      const alt = generateNewVariable();

      result.dependencies[alt] = map[key];
      result.keys.push(key);
      result.functions.push(`
        const ${key} = ${REACT}.useCallback(function () {
          ${alt}(${PROPS});
        }, [${PROPS}]);
      `);

      return result;
    },
    {
      dependencies: {},
      functions: [],
      keys: [],
    },
  );

  return {
    dependencies: {
      [REACT]: React,
      ...handles.dependencies,
    },
    initialize: handles.functions.join('\n'),
    props: handles.keys,
  };
};
