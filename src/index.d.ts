/**
 * Typescript definition file for Bach Compose and Enhancers
 */
import {Component} from 'react';

export = Compose;

// TODO: need return type?
declare function Compose(enhancers: ComposeEnhancers[]): Component;

type ComposeEnhancers = Enhancers.withEffect | Enhancers.withState;

/**
 * Enhancers
 */

/***
 * Circle back on the EnhancerReturnValue. I don't think we care what enhancer returns
 * from the perspective of someone consuming these types.  If that's the case,
 * the enhancers can just return unknown.
 *
 * IF we decide we need the EnhancerReturnValue, maybe we can type the properties better.
 */
// interface EnhancerReturnValue {
//   dependencies: object;
//   initialize: string;
//   props: string[];
// }

declare namespace Enhancers {
  // withEffect
  type effectReturn = () => void | void;
  type withEffect = (fn: () => effectReturn) => unknown;

  // withState
  type withState = (
    stateName: string,
    stateUpdaterName: string,
    initialState: object | Function,
  ) => unknown;
}
