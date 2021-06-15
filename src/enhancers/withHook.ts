import {PROPS} from '../constants';
import {EnhancerContext, EnhancerResult, StringKeyMap} from '../types';
import {isFunction} from '../util';

type ParameterValues<T> = ((t?: T) => unknown) | unknown;
type Props<T> = keyof T | Array<keyof T>;

const generateInvoke = (hookAlias: string, params: {[key: string]: unknown}): string => {
  const mapParam = (p: string): string => {
    const value = params[p];
    if (isFunction(value)) {
      return `${p}(${PROPS})`;
    }

    return p;
  };

  return `${hookAlias}(${Object.keys(params).map(mapParam).join(', ')})`;
};

const generateContainerCode = <T>(props: Props<T>, generateNewVariable: () => string): string[] => {
  if (!Array.isArray(props)) {
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

const normalizeProps = <T>(props?: Props<T>): string[] => {
  if (!props) {
    return [];
  }

  if (props instanceof Array) {
    return props as string[];
  }

  return [props as string];
};

const normalizedParameterValues = <T>(
  parameterValues: ParameterValues<T>,
  generateNewVariable: () => string,
): StringKeyMap<unknown> => {
  const wrappedInArray = Array.isArray(parameterValues) ? parameterValues : [parameterValues];

  const params: StringKeyMap<unknown> = {};
  wrappedInArray.forEach((value: unknown) => {
    params[generateNewVariable()] = value;
  });

  return params;
};

export default <T>(hook: Function, parameterValues: ParameterValues<T>, props?: Props<T>) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const hookAlias = generateNewVariable();

    const params = normalizedParameterValues(parameterValues, generateNewVariable);

    const containerCoder = generateContainerCode(props, generateNewVariable);
    const invokeCode = generateInvoke(hookAlias, params);

    return {
      dependencies: {
        [hookAlias]: hook,
        ...params,
      },
      initialize: `
      ${containerCoder[0]}${invokeCode};
      ${containerCoder[1]}
    `,
      props: normalizeProps(props),
    };
  };
