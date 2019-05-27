import {useState, useMemo} from 'react';
import {PROPS} from '../util/constants';

export const withState = (stateName, stateUpdaterName, initialValue) => ({
  generateNewVariable,
}) => {
  const initialValueAlias = generateNewVariable();
  const initialValueIsFunctionAlias = generateNewVariable();
  const computedInitialValueAlias = generateNewVariable();
  const stateValue = generateNewVariable();

  return {
    dependencies: {
      useState,
      useMemo,
      [initialValueAlias]: initialValue,
      [initialValueIsFunctionAlias]: Object.prototype.toString.call(initialValue) === '[object Function]',
    },
    initialize: `
      const ${computedInitialValueAlias} = ${initialValueIsFunctionAlias}
        ? useMemo(() => ${initialValueAlias}(${PROPS}), [])
        : ${initialValueAlias};
      const ${stateValue} = useState(${computedInitialValueAlias});
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `,
    props: [stateName, stateUpdaterName],
  };
};
