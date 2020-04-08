import {ReactNode, FunctionComponent} from 'react';
import {Enhancer, EnhancerContext, EnhancerList} from './types';
import {
  flatten,
  generateNewVariable,
  generateHOCFunction,
  combineEnhancerResults,
  transformHOCFunction,
} from './util';

export default <T>(
  ...enhancers: EnhancerList
): ((component: ReactNode) => FunctionComponent<T>) => (
  component: FunctionComponent,
): FunctionComponent<T> => {
  const context: EnhancerContext = {
    component,
    generateNewVariable: generateNewVariable(),
  };

  const enhancersArray = flatten<Enhancer>(enhancers, Infinity);
  const results = combineEnhancerResults(enhancersArray.map(enhancer => enhancer(context)));
  const originalHoc = generateHOCFunction(results, component);
  const hoc = transformHOCFunction(originalHoc, results.componentTransforms);

  return hoc;
};
