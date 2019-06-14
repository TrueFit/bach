import React from 'react';
import {REACT, PROPS, COMPONENT} from './util/constants';
import generateNewVariable from './util/generateNewVariable.js';
import generateAssignments from './util/generateAssignments.js';

// Actual Compose
const generateMap = enhancers => {
  const codeGenerationContext = {
    generateNewVariable: generateNewVariable(),
  };

  return enhancers
    .map(h => h(codeGenerationContext))
    .reduce(
      (result, enhancer) => {
        result.dependencies = {
          ...result.dependencies,
          ...enhancer.dependencies,
        };

        result.replacesProps |= enhancer.replacesProps;

        const propsAssignment = enhancer.props
          .map(x => `${PROPS}.${x} = ${x};`)
          .join('\n');

        result.blocks.push(`
          ${enhancer.initialize}
          ${propsAssignment}
        `);

        if (enhancer.render) {
          result.renders.push(enhancer.render);
        }

        return result;
      },
      {
        replacesProps: false,
        dependencies: {},
        blocks: [],
        renders: [],
      },
    );
};

export default (...enhancers) => (Component, options = {}) => {
  if (enhancers.length === 0) {
    return Component;
  }

  const map = generateMap(enhancers);

  const keys = Object.keys(map.dependencies);
  const blocks = map.blocks.join('\n');
  const breakpoint = options.debug?.breakpoint ? 'debugger;' : '';
  const assignments = generateAssignments([...keys, REACT, COMPONENT], 'this');
  const declare = map.replacesProps ? 'let' : 'const';
  const renders = map.renders.join('\n');

  if (options.debug?.log) {
    console.log(map, assignments); // eslint-disable-line
  }

  const hocDef = new Function(
    'wrapperProps',
    `
      ${breakpoint}
  
      ${declare} ${PROPS} = Object.assign({}, wrapperProps);

      ${assignments}

      ${blocks};

      ${renders}

      return ${REACT}.createElement(${COMPONENT}, ${PROPS});
    `,
  );

  const hoc = hocDef.bind({
    [REACT]: React,
    [COMPONENT]: Component,
    ...map.dependencies,
  });

  if (options.debug?.log) {
    console.log(hoc); // eslint-disable-line
  }

  return hoc;
};
