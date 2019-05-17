import {REACT} from '../util/constants';

export default (contextName, context) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const contextAlias = generateNewVariable();

  return {
    dependencies: {
      ...globalDependencies,
      [contextAlias]: context,
    },
    initialize: `const ${contextName} = ${REACT}.useContext(${contextAlias});`,
    props: [contextName],
  };
};
