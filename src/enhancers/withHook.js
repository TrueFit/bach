import isFunction from '../util/isFunction';
import isArray from '../util/isArray';
import {PROPS} from '../util/constants';

const invoke = (hookAlias, params) => {
  const mapParam = p => {
    const value = params[p];
    if (isFunction(value)) {
      return `${p}(${PROPS})`;
    }

    return p;
  };

  return `${hookAlias}(${Object.keys(params)
    .map(mapParam)
    .join(', ')})`;
};

const result = (props, generateNewVariable) => {
  if (!isArray(props)) {
    return [`const ${props} = `, ''];
  }

  if (props.length === 0) {
    return ['', ''];
  }

  const resultAlias = generateNewVariable();
  return [
    `const ${resultAlias} = `,
    props.map((p, i) => `const ${p} = ${resultAlias}[${i}];`).join('\n'),
  ];
};

export default (hook, parameterValues = [], props = []) => ({
  generateNewVariable,
}) => {
  const hookAlias = generateNewVariable();

  const normalizedParameterValues = isArray(parameterValues)
    ? parameterValues
    : [parameterValues];

  const params = normalizedParameterValues.reduce((acc, value) => {
    acc[generateNewVariable()] = value;

    return acc;
  }, {});

  const resultCode = result(props, generateNewVariable);

  return {
    dependencies: {
      [hookAlias]: hook,
      ...params,
    },
    initialize: `
      ${resultCode[0]}${invoke(hookAlias, params)};
      ${resultCode[1]}
    `,
    props: isArray(props) ? props : props ? [props] : [],
  };
};
