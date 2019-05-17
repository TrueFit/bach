import React from 'react';
import {REACT} from '../util/constants';

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      [REACT]: React,
      [initialValueAlias]: initialValue,
    },
    initialize: `const [${stateName}, ${stateUpdaterName}] = ${REACT}.useState(${initialValueAlias});`,
    props: [stateName, stateUpdaterName],
  };
};
