import {REACT, PROPS} from '../util/constants';
import CONSUMER from '../util/consumer';
import generateConditionCode from '../util/generateConditionCode';

export default (fn = CONSUMER, conditions) => ({
  globalDependencies,
  generateNewVariable,
}) => {
  const fnName = generateNewVariable();
  const conditionCode = generateConditionCode(conditions);

  return {
    dependencies: {
      ...globalDependencies,
      [fnName]: fn,
    },
    initialize: `${REACT}.useEffect(function () {
        return ${fnName}(${PROPS});
      }, [${conditionCode}]);`,
    props: [fnName],
  };
};
