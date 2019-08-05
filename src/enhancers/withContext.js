import {useContext} from 'react';
import {PROPS} from '../util/constants';
import generateAssignments from '../util/generateAssignments.js';

export default (propertyNames = [], contextSource) => ({
  generateNewVariable,
}) => {
  const context = generateNewVariable();

  const contextSourceAlias = generateNewVariable();
  const contextSourceValue =
    typeof contextSource === 'object'
      ? contextSource
      : `${PROPS}.${contextSource}`;

  const assignments = generateAssignments(propertyNames, context);

  return {
    dependencies: {
      useContext,
      [contextSourceAlias]: contextSourceValue,
    },
    initialize: `
      const ${context} = useContext(${contextSourceAlias});

      ${assignments}
    `,
    props: propertyNames,
  };
};
