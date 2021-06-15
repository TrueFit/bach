import {useRef} from 'react';
import {EnhancerContext, EnhancerResult} from '../types';

export default <T>(refName: keyof T, initialValue: unknown) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const initialValueAlias = generateNewVariable();

    return {
      dependencies: {
        useRef,
        [initialValueAlias]: initialValue,
      },
      initialize: `const ${refName} = useRef(${initialValueAlias});`,
      props: [refName as string],
    };
  };
