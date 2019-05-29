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

        const propsAssignment = enhancer.props
          .map(x => `${PROPS}.${x} = ${x};`)
          .join('\n');

        result.blocks.push(`
          ${enhancer.initialize}
          ${propsAssignment}
        `);

        return result;
      },
      {
        dependencies: {},
        blocks: [],
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

  if (options.debug?.log) {
    console.log(map, assignments); // eslint-disable-line
  }

  const hocDef = new Function(
    'wrapperProps',
    `
      ${breakpoint}
  
      let ${PROPS} = Object.assign({}, wrapperProps);

      ${assignments}

      ${blocks};

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
