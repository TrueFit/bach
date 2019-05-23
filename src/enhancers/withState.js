import {useState} from 'react';

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();
  const stateValue = `${stateName}Value`;

  return {
    dependencies: {
      useState,
      [initialValueAlias]: initialValue,
    },
    initialize: `
      const ${stateValue} = useState(${initialValueAlias});
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `,
    props: [stateName, stateUpdaterName],
  };
};
