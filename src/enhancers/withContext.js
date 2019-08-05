import {useContext} from 'react';
import {PROPS} from '../util/constants';
import generateAssignments from '../util/generateAssignments.js';

export default (propertyNames = [], contextSource) => ({
  generateNewVariable,
}) => {
  const context = generateNewVariable();
  const contextSourceAlias = generateNewVariable();

  const sourceIsObject = typeof contextSource === 'object';
  const hookTarget = sourceIsObject
    ? contextSourceAlias
    : `${PROPS}.${contextSource}`;

  const assignments = generateAssignments(propertyNames, context);

  return {
    dependencies: {
      useContext,
      [contextSourceAlias]: contextSource,
    },
    initialize: `
      const ${context} = useContext(${hookTarget});

      ${assignments}
    `,
    props: propertyNames,
  };
};
