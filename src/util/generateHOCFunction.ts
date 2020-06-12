/* eslint-disable no-new-func */

import React, {FunctionComponent, ReactNode} from 'react';
import {REACT, COMPONENT, PROPS} from '../constants';
import {EnhancerCombination} from './combineEnhancerResults';

import generateAssignments from './generateAssignments';
import generateRenderStatement from './generateRenderStatement';
import hoistStaticProps from './hoistStaticProps';

export default <T>(results: EnhancerCombination, component: ReactNode): FunctionComponent<T> => {
  const keys = Object.keys(results.dependencies);
  const assignments = generateAssignments([...keys, REACT, COMPONENT], 'this');
  const blocks = results.blocks.join('\n');
  const render = generateRenderStatement(results);

  const hocDef = new Function(
    'inboundProps',
    `
      ${assignments}
  
      let ${PROPS} = Object.assign({}, inboundProps);

      ${blocks}

      ${render}
    `,
  );

  const hoc = hocDef.bind({
    [REACT]: React,
    [COMPONENT]: component,
    ...results.dependencies,
  });

  hoistStaticProps(component, hoc);

  return hoc as FunctionComponent<T>;
};
