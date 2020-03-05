import {FunctionComponent, ReactNode} from 'react';

export type StringKeyCache = {[key: string]: unknown};

export type DependencyList<T> = Array<keyof T> | undefined;
export type ComponentTransform = (component: FunctionComponent) => FunctionComponent;

export type EnhancerResult = {
  dependencies: StringKeyCache;
  initialize: string;
  props: string[];
  transformComponent?: ComponentTransform;
};

export type EnhancerContext = {
  component: ReactNode;
  generateNewVariable: () => string;
};

export type Enhancer = (context: EnhancerContext) => EnhancerResult;
