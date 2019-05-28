import {useState, useMemo} from 'react';
import {PROPS} from '../util/constants';
import isFunction from '../util/isFunction';

const useObjectAsState = (stateValue, initialValueAlias) => ({
  dependencies: {},
  code: `const ${stateValue} = useState(${initialValueAlias});`,
});

const useFunctionAsState = (stateValue, initialValueAlias) => ({
  dependencies: {useMemo},
  code: `
    const ${stateValue} = useState(
      useMemo(() => ${initialValueAlias}(${PROPS}), [])
    );
  `,
});

export default (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const stateValue = generateNewVariable();
  const initialValueAlias = generateNewVariable();

  const useStateGenerator = isFunction(initialValue)
    ? useFunctionAsState
    : useObjectAsState;

  const useStateCode = useStateGenerator(stateValue, initialValueAlias);

  return {
    dependencies: {
      useState,
      [initialValueAlias]: initialValue,
      ...useStateCode.dependencies,
    },
    initialize: `
      ${useStateCode.code}
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `,
    props: [stateName, stateUpdaterName],
  };
};
