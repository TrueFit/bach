/**
 * Typescript definition file for Bach Compose and Enhancers
 */
declare module '@truefit/bach' {
  import * as React from 'react';
  import {ComponentType as Component, StatelessFunctionComponent} from 'react';

  // Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  // helper types
  type mapper<TInner, TOutter> = (input: TInner) => TOutter;

  // compose returns a function that receives a component(inner) and options and returns a
  // new new wrapped SFC(outer) with all enhancer props passed
  interface ComposeHOC<TInner, TOuter> {
    (component: Component<TInner>, options?: {}): StatelessFunctionComponent<
      TOuter
    >;
  }

  // Injects props and removes them from the prop requirements.
  // Optionally, adds new prop requirements from TNeedsProps.
  // export interface ComponentEnhancerWithProps<
  //   TInjectedProps,
  //   TNeedsProps = {}
  // > {
  //   <P extends TInjectedProps>(
  //     component: Component<P>,
  //   ): React.FunctionComponent<Omit<P, keyof TInjectedProps> & TNeedsProps>;
  // }

  // Compose pipe
  export function compose<TInner, TOuter>(
    ...enhancers: Function[]
  ): ComposeHOC<TInner, TOuter>;

  // enhancers return value
  type EnhancerReturn<TProps> = {
    dependencies: object;
    initialize: string;
    props: TProps[];
  };

  interface EnhancerHOC<TProps> {
    (context: object): EnhancerReturn<TProps>;
  }

  // withState
  type stateProps<
    TState,
    TStateName extends string,
    TStateUpdaterName extends string
  > = {[stateName in TStateName]: TState} &
    {[stateUpdateName in TStateUpdaterName]: (state: TState) => TState};

  export function withState<
    TOutter,
    TState,
    TStateName extends string,
    TStateUpdaterName extends string
  >(
    stateName: TStateName,
    stateUpdaterName: TStateUpdaterName,
    initialState: TState | mapper<TOutter, TState>,
  ): EnhancerHOC<stateProps<TState, TStateName, TStateUpdaterName>>;

  // withEffect
}
