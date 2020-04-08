/* eslint-disable @typescript-eslint/no-explicit-any */

const flatten = <T>(arr: Array<any>, depth = 1): Array<T> => {
  return depth > 0
    ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val), [])
    : arr.slice();
};

export default flatten;
