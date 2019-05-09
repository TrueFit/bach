import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';

export default (fn = CONSUMER) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const fnName = generateNewVariable();

  return {
    dependencies: {
      ...globalDependencies,
      [fnName]: fn,
    },
    initialize: `${REACT}.useEffect(function () {
        ${fnName}(${PROPS});
      }, [${PROPS}]);`,
    props: [fnName],
  };
};
