import {FunctionComponent} from 'react';

export type ComponentTransform = (component: FunctionComponent) => FunctionComponent;

export type EnhancerResult = {
  dependencies: object;
  initialize: string;
  props: string[];
  transformComponent?: ComponentTransform;
};

export type EnhancerContext = {
  generateNewVariable: () => string;
};

export type Enhancer = (context: EnhancerContext) => EnhancerResult;
