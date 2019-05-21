import {useState} from 'react';

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      useState,
      [initialValueAlias]: initialValue,
    },
    initialize: `const [${stateName}, ${stateUpdaterName}] = useState(${initialValueAlias});`,
    props: [stateName, stateUpdaterName],
  };
};
