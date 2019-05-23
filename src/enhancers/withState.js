import {useState} from 'react';
import generateAssignments from '../util/generateAssignments.js';

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();
  const stateValue = `${stateName}Value`;
  const assignments = generateAssignments(
    [stateName, stateUpdaterName],
    stateValue,
  );

  return {
    dependencies: {
      useState,
      [initialValueAlias]: initialValue,
    },
    initialize: `
      const ${stateValue} = useState(${initialValueAlias});
      ${assignments}
    `,
    props: [stateName, stateUpdaterName],
  };
};
