import React from 'react';
import {REACT} from '../util/constants';

export default (refName, initialValue) => ({generateNewVariable}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      [REACT]: React,
      [initialValueAlias]: initialValue,
    },
    initialize: `const ${refName} = ${REACT}.useRef(${initialValueAlias});`,
    props: [refName],
  };
};
