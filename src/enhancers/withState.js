import {REACT} from '../util/constants';

export default (stateName, stateUpdaterName, initialValue) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      ...globalDependencies,
      [initialValueAlias]: initialValue,
    },
    initialize: `const [${stateName}, ${stateUpdaterName}] = ${REACT}.useState(${initialValueAlias});`,
    props: [stateName, stateUpdaterName],
  };
};
