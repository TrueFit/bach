import {PROPS} from './util/constants';

const generateMap = helpers =>
  helpers.reduce(
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

const generateWrapper = (helpers, Component) => {
  const map = generateMap(helpers);
  const dependencyKeys = Object.keys(map.dependencies);
  const dependencyValues = Object.values(map.dependencies);
  const blocks = map.blocks.join('\n');

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
};

export default (...helpers) => Component => generateWrapper(helpers, Component);
