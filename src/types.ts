import {FunctionComponent, ReactNode} from 'react';

export type DependencyList<T> = Array<keyof T> | undefined;
export type ComponentTransform = (component: FunctionComponent) => FunctionComponent;

export type EnhancerResult = {
  dependencies: {[key: string]: unknown};
  initialize: string;
  props: string[];
  transformComponent?: ComponentTransform;
};

export type EnhancerContext = {
  component: ReactNode;
  generateNewVariable: () => string;
};

export type Enhancer = (context: EnhancerContext) => EnhancerResult;
