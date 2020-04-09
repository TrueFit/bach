import {FunctionComponent, ReactNode} from 'react';

export type StringKeyMap<T> = {[key: string]: T};

export type DependencyList<T> = Array<keyof T> | undefined;
export type ComponentTransform = (component: FunctionComponent | undefined) => FunctionComponent;

export type EnhancerResult = {
  dependencies: StringKeyMap<unknown>;
  initialize: string;
  props: string[];
  transformComponent?: ComponentTransform;
};

export type EnhancerContext = {
  component: ReactNode;
  generateNewVariable: () => string;
};

export type Enhancer = (context: EnhancerContext) => EnhancerResult;

export type EnhancerList = Enhancer[] | (Enhancer | Enhancer[])[];
