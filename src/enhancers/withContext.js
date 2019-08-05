import {useContext} from 'react';
import {PROPS} from '../util/constants';
import generateAssignments from '../util/generateAssignments.js';

export default (propertyNames = [], contextSource) => ({
  generateNewVariable,
}) => {
  const source = generateNewVariable();
  const context = generateNewVariable();
  const contextSourceAlias = generateNewVariable();

  const assignments = generateAssignments(propertyNames, context);

  return {
    dependencies: {
      useContext,
      contextSourceAlias: contextSource,
    },
    initialize: `
      const ${source} = typeof ${contextSourceAlias} === 'object' ? ${contextSourceAlias} : ${PROPS}.${contextSource};
      const ${context} = useContext(${source});

      ${assignments}
    `,
    props: propertyNames,
  };
};
