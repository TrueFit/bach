import React from 'react';
import {REACT, PROPS} from './util/constants';
import generateNewVariable from './util/generateNewVariable.js';

const generateMap = helpers => {
  const codeGenerationContext = {
    globalDependencies: {
      [REACT]: React,
    },
    generateNewVariable: generateNewVariable(),
  };

  return helpers
    .map(h => h(codeGenerationContext))
    .reduce(
      (result, helper) => {
        result.dependencies = {
          ...result.dependencies,
          ...helper.dependencies,
        };

        const propsAssignment = helper.props
          .map(x => `${PROPS}.${x} = ${x};`)
          .join('\n');

        result.blocks.push(`
        ${helper.initialize}
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

const generateWrapper = (helpers, Component) => {
  const map = generateMap(helpers);
  const dependencyKeys = Object.keys(map.dependencies);
  const dependencyValues = Object.values(map.dependencies);
  const blocks = map.blocks.join('\n');

  // try {
  const generate = new Function(
    ...dependencyKeys,
    'component',
    `
      return function Bach(wrapperProps) {
        const ${PROPS} = {...wrapperProps};

        ${blocks}

        return React.createElement(component, ${PROPS});
      };
      `,
  );

  return generate(...dependencyValues, Component);
  // } catch (err) {
  //   console.error(err);
  //   console.log(map);
  //   console.log(`
  //     return function Bach(wrapperProps) {
  //       const ${PROPS} = {...wrapperProps};

  //       ${blocks}

  //       return React.createElement(component, ${PROPS});
  //     };
  //     `);
  // }
};

export default (...helpers) => Component => generateWrapper(helpers, Component);
