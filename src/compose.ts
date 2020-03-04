import {ReactNode, FunctionComponent} from 'react';
import {Enhancer, EnhancerContext} from './types';
import {
  generateNewVariable,
  generateHOCFunction,
  combineEnhancerResults,
  transformHOCFunction,
} from './util';

export default <T>(...enhancers: Enhancer[]): ((component: ReactNode) => FunctionComponent<T>) => (
  component: FunctionComponent,
): FunctionComponent<T> => {
  const context: EnhancerContext = {
    component,
    generateNewVariable: generateNewVariable(),
  };

  const results = combineEnhancerResults(enhancers.map(enhancer => enhancer(context)));
  const originalHoc = generateHOCFunction(results, component);
  const hoc = transformHOCFunction(originalHoc, results.componentTransforms);

  return hoc;
};
