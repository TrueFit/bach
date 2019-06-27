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

        if (enhancer.staticProps) {
          result.staticProps = {
            ...result.staticProps,
            ...enhancer.staticProps,
          }
        }

        return result;
      },
      {
        replacesProps: false,
        dependencies: {},
        blocks: [],
        renders: [],
        staticProps: {},
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

  const definedStaticProps = Object.keys(Component).reduce((acc, key) => {
    acc[key] = Component[key];
    return acc;
  }, {});

  const staticProps = {
    ...definedStaticProps,
    ...map.staticProps
  };

  if (options.debug?.log) {
    console.log(map, assignments); // eslint-disable-line
  }

  const hocDef = new Function(
    'wrapperProps',
    `
      ${breakpoint}

      ${assignments}
  
      ${declare} ${PROPS} = Object.assign({}, wrapperProps);

      ${blocks};

      ${renders}

      return ${REACT}.createElement(${COMPONENT}, ${PROPS});
    `,
  );

  // bind dependencies
  const hoc = hocDef.bind({
    [REACT]: React,
    [COMPONENT]: Component,
    ...map.dependencies,
  });

  // copy over / assign static props
  Object.keys(staticProps).forEach(key => {
    hoc[key] = staticProps[key];
  });

  if (options.debug?.log) {
    console.log(hoc); // eslint-disable-line
  }

  return hoc;
};
