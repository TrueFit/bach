import {useContext} from 'react';
import {PROPS} from '../util/constants';
import generateAssignments from '../util/generateAssignments.js';

export default (propertyNames = [], contextName) => () => {
  const context = 'contextValue';
  const assignments = generateAssignments(propertyNames, context);

  return {
    dependencies: {
      useContext,
    },
    initialize: `
      const ${context} = useContext(${PROPS}.${contextName});
      ${assignments}
    `,
    props: propertyNames,
  };
};
