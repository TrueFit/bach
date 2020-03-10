/* eslint-disable no-new-func */

import React, {FunctionComponent, ReactNode} from 'react';
import {REACT, COMPONENT, PROPS} from '../constants';
import generateAssignments from './generateAssignments';
import {EnhancerCombination} from './combineEnhancerResults';

const hoistStaticProps = (component: ReactNode, hoc: Function): void => {
  Object.keys(component).forEach((key: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    hoc[key] = component[key];
  });
};

export default <T>(results: EnhancerCombination, component: ReactNode): FunctionComponent<T> => {
  const keys = Object.keys(results.dependencies);
  const assignments = generateAssignments([...keys, REACT, COMPONENT], 'this');
  const blocks = results.blocks.join('\n');

  const hocDef = new Function(
    'inboundProps',
    `
      ${assignments}
  
      let ${PROPS} = Object.assign({}, inboundProps);

      ${blocks}

      return ${REACT}.createElement(${COMPONENT}, ${PROPS});
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
