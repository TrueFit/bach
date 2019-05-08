import React from 'react';
import {REACT} from '../util/constants';
import newVariable from '../util/newVariable';

export default (contextName, context) => {
  const contextAlias = newVariable();

  return {
    dependencies: {
      [REACT]: React,
      [contextAlias]: context,
    },
    initialize: `const ${contextName} = ${REACT}.useContext(${contextAlias});`,
    props: [contextName],
  };
};
