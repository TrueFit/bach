/**
 * Typescript definition file for Bach Compose and Enhancers
 */

declare module 'bach' {
  import {Component, ComponentClass} from 'react';

  interface ComponentEnhancer<TInner, TOuter> {
    (component: Component<TInner>): ComponentClass<TOuter>;
  }

  export function compose<TInner, TOuter>(
    ...enhancers: Function[]
  ): ComponentEnhancer<TInner, TOuter>;

  /**
   * Enhancers
   */
  // withEffect
  // type effectReturn = () => void | void;
  // type withEffect = (fn: () => effectReturn) => unknown;

  // // withState
  // type withState = (
  //   stateName: string,
  //   stateUpdaterName: string,
  //   initialState: object | Function,
  // ) => unknown;
}
