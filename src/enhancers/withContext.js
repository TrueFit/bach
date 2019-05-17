import {REACT, PROPS} from '../util/constants';

export default (propertyNames = [], contextName) => ({globalDependencies}) => {
  const contextProps = propertyNames.join(',');

  return {
    dependencies: globalDependencies,
    initialize: `const {${contextProps}} = ${REACT}.useContext(${PROPS}.${contextName});`,
    props: propertyNames,
  };
};
