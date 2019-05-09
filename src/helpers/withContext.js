import React from 'react';
import {REACT} from '../util/constants';

export default (contextName, context) => ({generateNewVariable}) => {
  const contextAlias = generateNewVariable();

  return {
    dependencies: {
      [REACT]: React,
      [contextAlias]: context,
    },
    initialize: `const ${contextName} = ${REACT}.useContext(${contextAlias});`,
    props: [contextName],
  };
};
