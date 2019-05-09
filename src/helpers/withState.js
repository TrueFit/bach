import React from 'react';
import {REACT} from '../util/constants';

export default (stateName, stateUpdaterName, initialValue) => () => ({
  dependencies: {
    [REACT]: React,
  },
  initialize: `const [${stateName}, ${stateUpdaterName}] = ${REACT}.useState(${initialValue});`,
  props: [stateName, stateUpdaterName],
});
