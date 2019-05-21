import {useContext} from 'react';
import {PROPS} from '../util/constants';

export default (propertyNames = [], contextName) => () => {
  const contextProps = propertyNames.join(',');

  return {
    dependencies: {
      useContext,
    },
    initialize: `const {${contextProps}} = useContext(${PROPS}.${contextName});`,
    props: propertyNames,
  };
};
