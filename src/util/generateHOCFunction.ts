/* eslint-disable no-new-func */

import React, {FunctionComponent, ReactNode} from 'react';
import {REACT, COMPONENT, PROPS} from '../constants';
import generateAssignments from './generateAssignments';
import {EnhancerCombination} from './combineEnhancerResults';

export default <T>(results: EnhancerCombination, component: ReactNode): FunctionComponent<T> => {
  const declare = 'const';
  const keys = Object.keys(results.dependencies);
  const assignments = generateAssignments([...keys, REACT, COMPONENT], 'this');
  const blocks = results.blocks.join('\n');

  const hocDef = new Function(
    'inboundProps',
    `
      ${assignments}
  
      ${declare} ${PROPS} = Object.assign({}, inboundProps);

      ${blocks}

      return ${REACT}.createElement(${COMPONENT}, ${PROPS});
    `,
  );

  const hoc = hocDef.bind({
    [REACT]: React,
    [COMPONENT]: component,
    ...results.dependencies,
  });

  return hoc as FunctionComponent<T>;
};
