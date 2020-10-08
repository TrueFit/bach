/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {ReactNode, FunctionComponent} from 'react';
import {Enhancer, EnhancerContext, EnhancerList} from './types';
import {
  flatten,
  generateNewVariable,
  generateHOCFunction,
  combineEnhancerResults,
  transformHOCFunction,
} from './util';

interface Generic1<A> {}
interface Generic2<A, B> {}
interface Generic3<A, B, C> {}

type Enhance<T> = (component: ReactNode) => FunctionComponent<T>;

export function compose<A, B, C, T extends Generic3<A, B, C>>(
  ...enhancers: EnhancerList
): Enhance<T>;
export function compose<A, B, T extends Generic2<A, B>>(...enhancers: EnhancerList): Enhance<T>;
export function compose<A, T extends Generic1<A>>(...enhancers: EnhancerList): Enhance<T>;
export function compose<T>(...enhancers: EnhancerList): Enhance<T>;

export function compose<T>(...enhancers: EnhancerList): Enhance<T> {
  return (component: ReactNode): FunctionComponent<T> => {
    const context: EnhancerContext = {
      component,
      generateNewVariable: generateNewVariable(),
    };

    const enhancersArray = flatten<Enhancer>(enhancers, Infinity);
    const results = combineEnhancerResults(enhancersArray.map((enhancer) => enhancer(context)));
    const originalHoc = generateHOCFunction<T>(results, component);
    const hoc = transformHOCFunction<T>(originalHoc, results.componentTransforms);

    return hoc;
  };
}
