import React from 'react';
import {REACT, PROPS} from '../util/constants';

export default (propertyNames = [], contextName) => () => {
  const contextProps = propertyNames.join(',');

  return {
    dependencies: {
      [REACT]: React,
    },
    initialize: `const {${contextProps}} = ${REACT}.useContext(${PROPS}.${contextName});`,
    props: propertyNames,
  };
};
