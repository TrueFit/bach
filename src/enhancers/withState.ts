import {useState, useMemo} from 'react';
import {EnhancerContext, EnhancerResult} from '../types';
import {isFunction} from '../util';
import {PROPS} from '../constants';

const useObjectAsState = <S>(stateValue: string, initialValueAlias: S): string =>
  `const ${stateValue} = useState(${initialValueAlias});`;

const useFunctionAsState = <S>(stateValue: string, initialValueAlias: S): string =>
  `const ${stateValue} = useState(
    useMemo(function() {
      return ${initialValueAlias}(${PROPS});
    }, [])
  );
  `;

export default <T, S>(
    stateName: keyof T,
    stateUpdaterName: keyof T,
    initialValue: S | ((t: T | undefined) => S),
  ) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const stateValue = generateNewVariable();
    const initialValueAlias = generateNewVariable();

    const useStateGenerator = isFunction(initialValue) ? useFunctionAsState : useObjectAsState;

    const useStateCode = useStateGenerator(stateValue, initialValueAlias);

    return {
      dependencies: {
        useMemo,
        useState,
        [initialValueAlias]: initialValue,
      },
      initialize: `
      ${useStateCode}
      const ${stateName} = ${stateValue}[0];
      const ${stateUpdaterName} = ${stateValue}[1];
    `,
      props: [stateName as string, stateUpdaterName as string],
    };
  };
