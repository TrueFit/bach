import {useContext, Context} from 'react';
import {PROPS} from '../constants';
import {EnhancerContext, EnhancerResult} from '../types';
import {generateAssignments} from '../util';

export default <T>(propertyNames: Array<keyof T>, contextSource: Context<T> | string) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const context = generateNewVariable();
    const contextSourceAlias = generateNewVariable();

    const sourceIsObject = typeof contextSource === 'object';
    const hookTarget = sourceIsObject ? contextSourceAlias : `${PROPS}.${contextSource}`;

    const assignments = generateAssignments(propertyNames as string[], context);

    return {
      dependencies: {
        useContext,
        [contextSourceAlias]: contextSource,
      },
      initialize: `
      const ${context} = useContext(${hookTarget});

      ${assignments}
    `,
      props: propertyNames as string[],
    };
  };
