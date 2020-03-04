import {FunctionComponent} from 'react';
import {EnhancerResult} from '../types';

export default (props: {[key: string]: unknown}) => (): EnhancerResult => {
  return {
    dependencies: {},
    initialize: '',
    props: [],

    transformComponent: (component: FunctionComponent): FunctionComponent => {
      Object.keys(props).forEach((key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        component[key] = props[key];
      });

      return component;
    },
  };
};
