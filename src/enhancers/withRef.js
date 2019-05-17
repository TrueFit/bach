import {REACT} from '../util/constants';

export default (refName, initialValue) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();

  return {
    dependencies: {
      ...globalDependencies,
      [initialValueAlias]: initialValue,
    },
    initialize: `const ${refName} = ${REACT}.useRef(${initialValueAlias});`,
    props: [refName],
  };
};
