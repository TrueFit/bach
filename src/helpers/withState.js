import {REACT} from '../util/constants';

export default (stateName, stateUpdaterName, initialValue) => ({
  globalDependencies,
}) => ({
  dependencies: globalDependencies,
  initialize: `const [${stateName}, ${stateUpdaterName}] = ${REACT}.useState(${initialValue});`,
  props: [stateName, stateUpdaterName],
});
