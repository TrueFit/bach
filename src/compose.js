import React from 'react';
import {REACT, PROPS} from './util/constants';
import generateNewVariable from './util/generateNewVariable.js';

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

const generateWrapper = (enhancers, Component, options) => {
  const map = generateMap(enhancers);
  const dependencyKeys = Object.keys(map.dependencies);
  const dependencyValues = Object.values(map.dependencies);
  const blocks = map.blocks.join('\n');

  if (options.debug) {
    console.log(map); // eslint-disable-line
  }

  try {
    const generate = new Function(
      ...dependencyKeys,
      REACT,
      'component',
      `
      return function Bach(wrapperProps) {
        const ${PROPS} = {...wrapperProps};

        ${blocks}

        return ${REACT}.createElement(component, ${PROPS});
      };
      `,
    );

    const hoc = generate(...dependencyValues, React, Component);
    if (options.debug) {
      console.log(hoc); // eslint-disable-line
      console.log(hoc.toString()); // eslint-disable-line
    }

    return hoc;
  } catch (err) {
    if (options.debug) {
      console.error(err); // eslint-disable-line
    }

    throw err;
  }
};

export default (...enhancers) => (Component, options = {}) =>
  generateWrapper(enhancers, Component, options);
