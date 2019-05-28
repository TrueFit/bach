import {useState, useMemo} from 'react';
import {PROPS} from '../util/constants';

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();
  const stateValue = generateNewVariable();
  const initialValueIsFunction = Object.prototype.toString.call(initialValue) === '[object Function]';
  const enhancerObj = {
    dependencies: {
      useState,
      [initialValueAlias]: initialValue,
    },
    props: [stateName, stateUpdaterName],
  };

  if(initialValueIsFunction) {
    enhancerObj.dependencies.useMemo = useMemo;
    const memoizedInitialValueAlias = generateNewVariable();
    enhancerObj.initialize = `
      const ${memoizedInitialValueAlias} = useMemo(() => ${initialValueAlias}(${PROPS}), []);
      const ${stateValue} = useState(${memoizedInitialValueAlias});
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `
  } else {
    enhancerObj.initialize = `
      const ${stateValue} = useState(${initialValueAlias});
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `
  }
  return enhancerObj;
};
