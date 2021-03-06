# @truefit/bach

## Overview

Bach is a utility library the allows React developer to compose their components in a functional manner.

The goal is to help create a codebase that is readable, flexible, testable, and maintainable. In our experience, following this convention generally leads to a collection of single use, small functions that can easily be shared across a codebase. The ideal is that components should be focused on rendering, allowing other concerns to be coded elsewhere and passed in.

You can find a full React project with simple working examples of each hook, as well as more complex examples that combine hooks here: [https://github.com/TrueFit/bach-examples](https://github.com/TrueFit/bach-examples).

## Version 2.0

With the release of version 2.0, Bach has been updated to Typescript.

We did our best to maintain backwards compatibility and believe we have. If you find something, please let us know.

## Conception

At a high level, we liked the syntax that [Recompose](https://github.com/acdlite/recompose) enabled in our source. The advent of React hooks has forced us to move away from recompose since it has a couple of major drawbacks in this new world (no hooks, HOC hell, and the author deprecated it). We searched for a comparable library in the community, but were unable to find one that fit our needs.

At this point you may be asking, why not just use hooks - which is a fair question. In short, we aren't really fans of the syntax of hooks. In our opinion, they tend to add a lot of code and concerns to a component that don't belong in a presentational function. That said, we definitely embrace the push towards functional components that has come along with React's introduction of hooks - we just find the compositional approach to produce "better" code.

Thus we decided to write this library to fill the hole in the community the deprecation of recompose left. We set the following guidelines for the library:

- Allow developers to compose a series of functional concerns around components
- Have only one HOC component wrapper regardless of the number of enhancers
- Prefer the use of React hooks for implementation
- Provide a simple interface to support the addition of custom enhancers

We are pretty happy with where we ended up and hope it will prove helpful not just to us, but also the React community at large. We welcome questions, thoughts, and contributions from the community (see Contributing below). If you use it and find it helpful, we'd love to hear about that as well.

## Installation

```
npm install @truefit/bach
```

or

```
yarn add @truefit/bach
```

## Basic Composition

#### Typescript

```Typescript
import React from 'react';
import {compose, withCallback} from '@truefit/bach';

type Props = {
  handeClick: () => void;
}

const Component = ({handleClick}: Props) => (
  <div>
    <button onClick={handleClick}>
      Click Me
    </button>
  </div>
);

export default compose<Props>(
  withCallback<Props>('handleClick', () => () => {
    alert('Hello There');
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withCallback} from '@truefit/bach';

const Component = ({handleClick}) => (
  <div>
    <button onClick={handleClick}>
      Click Me
    </button>
  </div>
);

export default compose(
  withCallback('handleClick', () => () => {
    alert('Hello There');
  }),
)(Component);
```

## Enhancers

### Overview

Enhancers are the central mechanism for composing components with @truefit/bach. In general, you will declare a series of enhancers for each component that together compose all of the supporting logic that component needs to render. For example, you commonly have a couple of state enhancers combined with callbacks and effects.

Underneath the covers, @truefit/bach does things a little differently than its predecessors. Rather than have a a huge tree of HOCs wrapping your component, the compose function combines all of your enhancers into a single HOC generated at runtime. This allows your code to follow all of the hook rules while still being composed functionally.

_Order matters:_ we keep the definition of the generated code in the same order you put your enhancers in the compose call, thus code only has access to the properties defined before it.

As discussed below, this library was built with React Hooks in mind, thus the base library (this one) is restricted to having React as it's sole dependency. We wrapped all of the standard React hooks, except for useImperativeHandle (we still haven't seen a good use for it) and useDebugValue (it's targeted at custom hooks which are outside of the scope of this library).

### Enhancer List

- [withCallback](#withCallback)
- [withContext](#withContext)
- [withEffect](#withEffect)
- [withLayoutEffect](#withLayoutEffect)
- [withMemo](#withMemo)
- [withReducer](#withReducer)
- [withRef](#withRef)
- [withState](#withState)
- [withHook](#withHook)

### withCallback

Creates a memoized callback passed to component with the name specified.

_Enhancer Signature_

| Parameter    | Type     | Description                                                                                           |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| callbackName | string   | the name of the callback in the props passed to the wrapped component                                 |
| fn           | function | the function to invoke when the callback is invoked by the component                                  |
| conditions   | string[] | names of the properties on the props object react should restrict the revaluation of this callback to |

_Example 1_

#### Typescript

```Typescript
import React from 'react';
import {compose, withCallback} from '@truefit/bach';

type Props = {
  handeClick: () => void;
}

const Component = ({handleClick}: Props) => (
  <div>
    <button onClick={handleClick}>
      Click Me
    </button>
  </div>
);

export default compose<Props>(
  withCallback<Props>('handleClick', () => () => {
    alert('Hello There');
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withCallback} from '@truefit/bach';

const Component = ({handleClick}) => (
  <div>
    <button onClick={handleClick}>
      Click Me
    </button>
  </div>
);

export default compose(
  withCallback('handleClick', (props) => () => {
    alert('Hello There');
  }),
)(Component);
```

_Example 2_

#### Typescript

```Typescript
import React from 'react';
import {compose, withState, withCallback} from '@truefit/bach';

type Props = {
  count: number;
  setCount: (n: number) => void;

  alterCount: (n: number) => () => void;
}

const Component = ({count, alterCount}) => (
  <div>
    <h1>With Callback And State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={alterCount(1)}>Increment</button>
      <button onClick={alterCount(-1)}>Decrement</button>
    </div>
  </div>
);

export default compose(
  withState<Props, number>('count', 'setCount', 0),

  withCallback<Props>('alterCount', ({count, setCount}: Props) => (delta: number) => () => {
    setCount(count + delta);
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withState, withCallback} from '@truefit/bach';

const Component = ({count, alterCount}) => (
  <div>
    <h1>With Callback And State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={alterCount(1)}>Increment</button>
      <button onClick={alterCount(-1)}>Decrement</button>
    </div>
  </div>
);

export default compose(
  withState('count', 'setCount', 0),

  withCallback('alterCount', ({count, setCount}) => delta => () => {
    setCount(count + delta);
  }),
)(Component);
```

_React Hook_

[useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)

### withContext

Accepts a context object and returns the current context value for that context.

_Enhancer Signature_

| Parameter       | Type              | Description                                                                                              |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| contextProperty | string[]          | the names of the props in the context that are mapped to the props passed to the wrapped component       |
| contextSource   | Context or string | either the context object or the name of the prop in the HOC that points to the context to use as source |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, withContext} from '@truefit/bach';

type Props = {
  message: string;
};

type Context = {
  message: string;
};

const context = React.createContext<Context>({message: 'Hello There'});

const Component = ({message}: Props) => {
  return (
    <div>
      <h1>With Context</h1>
      <div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default compose(
  withContext<Context>(['message'], context)
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withContext} from '@truefit/bach';

const context = React.createContext({message: 'Hello Child'});

const Component = ({message}) => {
  return (
    <div>
      <h1>With Context</h1>
      <div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};

export default compose(
  withContext(['message'], context)
)(Component);
```

_React Hook_

[useContext](https://reactjs.org/docs/hooks-reference.html#usecontext)

### withEffect

Accepts a function that contains imperative, possibly effect creating code.

_Enhancer Signature_

| Parameter  | Type     | Description                                                                                     |
| ---------- | -------- | ----------------------------------------------------------------------------------------------- |
| fn         | function | the function to invoke when the values of properties change on the wrapped component            |
| conditions | string[] | names of the properties on the props object react should restrict the firing of the function to |

_Example_

#### Typescript

```Javascript
import React from 'react';
import {compose, withEffect} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Effect</h1>
  </div>
);

export default compose(
  withEffect(() => {
    console.log('Effect Fired');
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withEffect} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Effect</h1>
  </div>
);

export default compose(
  withEffect((props) => {
    console.log('Effect Fired');
  }),
)(Component);
```

_React Hook_

[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)

### withLayoutEffect

Like withEffect, but used for the times when invocation cannot be deferred, thus it fires synchronously after all DOM mutations.

_Enhancer Signature_

| Parameter  | Type     | Description                                                                                     |
| ---------- | -------- | ----------------------------------------------------------------------------------------------- |
| fn         | function | the function to invoke when the values of properties change on the wrapped component            |
| conditions | string[] | names of the properties on the props object react should restrict the firing of the function to |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, withLayoutEffect} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Effect</h1>
  </div>
);

export default compose(
  withLayoutEffect(() => {
    console.log('Effect Fired');
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withLayoutEffect} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Effect</h1>
  </div>
);

export default compose(
  withLayoutEffect((props) => {
    console.log('Effect Fired');
  }),
)(Component);
```

_React Hook_

[useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)

### withMemo

Creates a memoized value.

_Enhancer Signature_

| Parameter  | Type     | Description                                                                                     |
| ---------- | -------- | ----------------------------------------------------------------------------------------------- |
| memoName   | string   | the name of the memoized value in the props passed to the wrapped component                     |
| fn         | function | the function to invoke to produce the memoized value                                            |
| conditions | string[] | names of the properties on the props object react should restrict the firing of the function to |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, withMemo} from '@truefit/bach';

type Props = {
  message: string;
};

const Component = ({message}: Props) => (
  <div>
    <h1>With Memo</h1>
    <div>
      <h2>Message: {message}</h2>
    </div>
  </div>
);

export default compose(
  withMemo<Props>('message', () => {
    return 'Hello World';
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withMemo} from '@truefit/bach';

const Component = ({message}) => (
  <div>
    <h1>With Memo</h1>
    <div>
      <h2>Message: {message}</h2>
    </div>
  </div>
);

export default compose(
  withMemo('message', () => {
    return 'Hello World';
  }),
)(Component);
```

_React Hook_

[useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)

### withReducer

An alternative to useState. Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method.

@truefit/bach will create a dispatchProperty in props with the format `${reducerName}Dispatch`.

_Enhancer Signature_

| Parameter    | Type     | Description                                                                                                                                |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| reducerName  | string   | the name of the reducer value in the props passed to the wrapped component                                                                 |
| reducer      | function | the reducer function that conforms to the signature (state, action) => newState                                                            |
| initialValue | any      | the initial value of the reducer                                                                                                           |
| init         | function | a function that returns the initial value of the reducer the 1st time the reducer is invoked. Used for lazy initialization of the reducer. |

_Example_

#### Typescript

```Typescript
import React, {Dispatch} from 'react';
import {compose, withReducer} from '@truefit/bach';

enum ActionType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
}

type Action = {type: ActionType};

type Props = {
  count: number;
  countDispatch: Dispatch<Action>;
};

const Component = ({count, countDispatch}: Props) => (
  <div>
    <h1>With Reducer</h1>
    <div>
      <h2>Count: {count}</h2>
      <button type="button" onClick={() => countDispatch({type: ActionType.INCREMENT})}>
        Increment
      </button>
      <button type="button" onClick={() => countDispatch({type: ActionType.DECREMENT})}>
        Decrement
      </button>
    </div>
  </div>
);

const reducer = (state: number, action: Action) => {
  switch (action.type) {
    case ActionType.INCREMENT:
      return state + 1;

    case ActionType.DECREMENT:
      return state - 1;

    default:
      return state;
  }
};

export default compose(
  withReducer<Props, number, Action>('count', reducer, 0)
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withReducer} from '@truefit/bach';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const Component = ({count, countDispatch}) => (
  <div>
    <h1>With Reducer</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => countDispatch({type: INCREMENT})}>
        Increment
      </button>
      <button onClick={() => countDispatch({type: DECREMENT})}>
        Decrement
      </button>
    </div>
  </div>
);

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    case DECREMENT:
      return state - 1;

    default:
      return state;
  }
};

export default compose(
  withReducer('count', reducer, 0),
)(Component);
```

_React Hook_

[useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)

### withRef

Creates a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

_Enhancer Signature_

| Parameter    | Type   | Description                                                              |
| ------------ | ------ | ------------------------------------------------------------------------ |
| refName      | string | the name of the ref pointer in the props passed to the wrapped component |
| initialValue | any    | the initial value of the ref.current                                     |

_Example_

#### Typescript

```Typescript
import React, {MutableRefObject} from 'react';
import {compose, withRef, withCallback} from '@truefit/bach';

type Props = {
  textBox1: MutableRefObject<HTMLInputElement>;
  textBox2: MutableRefObject<HTMLInputElement>;

  focus1: () => void;
  focus2: () => void;
};

const Component = ({textBox1, textBox2, focus1, focus2}: Props) => (
  <div>
    <h1>With Ref</h1>
    <div>
      <input ref={textBox1} />
      <button type="button" onClick={focus1}>
        Focus Me
      </button>
    </div>
    <div>
      <input ref={textBox2} />
      <button type="button" onClick={focus2}>
        Focus Me
      </button>
    </div>
  </div>
);

export default compose(
  withRef('textBox1', null),
  withRef('textBox2', null),

  withCallback<Props>('focus1', ({textBox1}) => () => {
    textBox1.current.focus();
  }),
  withCallback<Props>('focus2', ({textBox2}) => () => {
    textBox2.current.focus();
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withRef, withCallback} from '@truefit/bach';

const Component = ({textBox1, textBox2, focus1, focus2}) => (
  <div>
    <h1>With Ref</h1>
    <div>
      <input ref={textBox1} />
      <button onClick={focus1}>Focus Me</button>
    </div>
    <div>
      <input ref={textBox2} />
      <button onClick={focus2}>Focus Me</button>
    </div>
  </div>
);

export default compose(
  withRef('textBox1', null),
  withRef('textBox2', null),

  withCallback('focus1', ({textBox1}) => () => {
    textBox1.current.focus();
  }),
  withCallback('focus2', ({textBox2}) => () => {
    textBox2.current.focus();
  }),
)(Component);
```

_React Hook_

[useRef](https://reactjs.org/docs/hooks-reference.html#useref)

### withState

Creates a stateful value, and a function to update it.

_Enhancer Signature_

| Parameter        | Type            | Description                                                                                                   |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| stateName        | string          | the name of the state value in the props passed to the wrapped component                                      |
| stateUpdaterName | string          | the name of the function in the props passed to the wrapped component that will update state when invoked     |
| initialValue     | any or function | the initial value of the state OR a function that receives `props` and returns the initial value of the state |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, withState} from '@truefit/bach';

type Props = {
  count: number;
  setCount: (value: number) => void;
}

const Component = ({count, setCount}: Props) => (
  <div>
    <h1>With State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  </div>
);

export default compose(
  withState<Props, number>('count', 'setCount', 0)
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withState} from '@truefit/bach';

const Component = ({count, setCount}) => (
  <div>
    <h1>With State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  </div>
);

export default compose(
  withState('count', 'setCount', 0)
)(Component);
```

_Example (with initialValue function)_

#### Typescript

```Typescript
import React from 'react';
import PropTypes from 'prop-types';
import {compose, withState} from '@truefit/bach';

type Props = {
  count: number;
  setCount: (value: number) => void;
}

const Component = ({count, setCount}: Props) => (
  <div>
    <h1>With State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  </div>
);

export default compose(
  withState<Props>('count', 'setCount', () => 0)
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import PropTypes from 'prop-types';
import {compose, withState} from '@truefit/bach';

const Component = ({count, setCount}) => (
  <div>
    <h1>With State</h1>
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  </div>
);

export default compose(
  withState('count', 'setCount', () => 0)
)(Component);
```

_React Hook_

[useState](https://reactjs.org/docs/hooks-reference.html#usestate)

### withHook

Allows you to map any hook into an enhancer to use into the compose chain.

_Enhancer Signature_

| Parameter       | Type               | Description                                                                                                                                                                                                                                                                                |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| hook            | function           | the hook you want to use                                                                                                                                                                                                                                                                   |
| parameterValues | any or function    | the values that should be passed to they hook as parameters in the order they are to be passed. If you only have one parameter you may just pass the parameter. You may also pass a function to be lazily evaluated and passed props to produce the value                                  |
| props           | string or string[] | the names of the props returned by the hook. Should be a string if the hook returns an object or value (for example - useMemo), an string[]if the hook returns an array of values (for example - useState), or it may be omitted if the hook has no return value (for example - useEffect) |

_Example_

#### Typescript

```Typescript
import React, {useState, useMemo, useEffect} from 'react';
import {compose, withHook} from '@truefit/bach';

type Props = {
  count: number;
  setCount: (c: number) => void;

  oneMore: number;
};

const Component = ({count, setCount, oneMore}: Props) => (
  <div>
    <h1>With Hook</h1>
    <h2>Count: {count}</h2>
    <h2>One More: {oneMore}</h2>
    <div>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        + 1
      </button>
    </div>
  </div>
);

export default compose(
  withHook<Props>(useState, 0, ['count', 'setCount']),
  withHook<Props>(useMemo, ({count}: Props) => () => count + 1, 'oneMore'),

  withHook<Props>(useEffect, ({count}: Props) => () => {
    console.log(`Count ${count}`); // eslint-disable-line
  }),
)(Component);
```

#### Javascript

```Javascript
import React, {useState, useMemo, useEffect} from 'react';
import {compose, withHook} from '@truefit/bach';

const Component = ({count, setCount, oneMore}) => (
  <div>
    <h1>With Hook</h1>
    <h2>Count: {count}</h2>
    <h2>One More: {oneMore}</h2>
    <div>
      <button onClick={() => { setCount(count + 1); }}>+ 1</button>
    </div>
  </div>
);

export default compose(
  withHook(useState, 0, ['count', 'setCount']),
  withHook(useMemo, ({count}) => () => count + 1, 'oneMore'),

  withHook(useEffect, ({count}) => () => {
    console.log(`Count ${count}`); // eslint-disable-line
  }),
)(Component);
```

#### withStaticProps

Allows you to attach static props to the resultant HOC component. Bach will also copy any static properties defined on the component passed to compose up to the generated HOC.

_Enhancer Signature_

| Parameter | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| props     | object | an object containing the key-value pairs to use as static props |

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, withStaticProps} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Static Props</h1>
  </div>
);

export default compose(
  withStaticProps({
    navigationOptions: {
      headerTitle: 'Bach',
    },
  }),
)(Component);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, withStaticProps} from '@truefit/bach';

const Component = () => (
  <div>
    <h1>With Static Props</h1>
  </div>
);

export default compose(
  withStaticProps({
    navigationOptions: {
      headerTitle: 'Bach',
    },
  }),
)(Component);
```

### Composing Enhancers

Sometimes it is helpful to be able to group enhancers into a named object that can be used across multiple components in your codebase. To support this, bach exposes the exposes the composeEnhancers function (you could alternatively use a native array, but we think this reads better).

_Example_

#### Typescript

```Typescript
import React from 'react';
import {compose, composeEnhancers, withCallback} from '@truefit/bach';
import {withActions, withSelector} from '@truefit/bach-redux';
import {withStyles} from '@truefit/bach-material-ui';

const Component = () => (
  <div>
    <h1>Headline</h1>
  </div>
);

const withArticles = composeEnhancers(
  withActions({loadArticles}),
  withSelector('articles', articlesSelector),
);

export default compose(
  withArticles,
  withStyles({
    container: {
      width: 100,
    }
  }),
);
```

#### Javascript

```Javascript
import React from 'react';
import {compose, composeEnhancers, withCallback} from '@truefit/bach';
import {withActions, withSelector} from '@truefit/bach-redux';
import {withStyles} from '@truefit/bach-material-ui';

const Component = () => (
  <div>
    <h1>Headline</h1>
  </div>
);

const withArticles = composeEnhancers(
  withActions({loadArticles}),
  withSelector('articles', articlesSelector),
);

export default compose(
  withArticles,
  withStyles({
    container: {
      width: 100,
    }
  }),
);
```

## Other enhancer libraries

One of the guidelines mentioned above was to make it easy for others to add enhancers for their own projects. Below are a couple of "additional" libraries that we have developed for other libraries that we commonly use, but didn't want to be a part of the base dependencies.

### [Redux](https://github.com/TrueFit/bach-redux)

This enhancer allows you to connect the component to your Redux store.

### [React Material](https://github.com/TrueFit/bach-react-material)

This enhancer allows you to use the styling HOC withStyles from the [React Material UI](https://material-ui.com/) library in a compositional approach.

### [Recompose](https://github.com/TrueFit/bach-recompose)

This library implements many of the enhancers found in the recompose library that are not tightly tied to react hooks.

## Creating your own enhancers

We would love to see members of the community add their own enhancers. If you come up with one that is applicable to the larger community (for example, wrapping a different React-CSS framework), please contact us so that we can add it to the list above.

To create your own enhancers, you need to pass a function to the compose method that returns a js object with the required properties. This is typically done as the result of a curried function, you can check the source code of existing enhancers for reference.

### Function Signature

Your enhance should follow the following signature:

```Typescript
type StringKeyCache = {[key: string]: unknown};
type ComponentTransform = (component: FunctionComponent) => FunctionComponent;

type EnhancerResult = {
  dependencies: StringKeyCache;
  initialize: string;
  props: string[];
  transformComponent?: ComponentTransform;
};

type EnhancerContext = {
  component: ReactNode;
  generateNewVariable: () => string;
};

type Enhancer = (context: EnhancerContext) => EnhancerResult;
```

| Property            | Type     | Description                                                                                                                                                                                                                       |
| ------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| generateNewVariable | function | a utility function that will generate a random 16 character string that can be used as a variable name in your initialize code. These strings are guaranteed to be unique inside the scope of the single HOC component generated. |

### Return Object

| Property           | Type                                                           | Description                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dependencies       | {[key: string]: unknown}                                       | a map of the dependencies for your enhancer. These will be available to your initialize code by the keys specified. The compose method reduces all keys to a single unique key set |
| initialize         | string                                                         | the code that will be added in line in order to the generated HOC                                                                                                                  |
| props              | string[]                                                       | the properties that the code creates that need to be added to the overall property object that will be passed to the wrapped component                                             |
| transformComponent | (component: FunctionComponent) => FunctionComponent (optional) | a function that is passed the resultant HOC, the function is expected to return an HOC to use                                                                                      |

### Initialize

As mentioned above, we wanted to keep the levels of HOC to a max of one. To accomplish this goal, rather than have a series of functions, we need each enhancer to actually expose the code it requires to work. The compose method combines all of these string of code into a single HOC at runtime. Under the covers, compose uses [`new Function()`](https://remarkablemark.org/blog/2018/05/15/javascript-eval-vs-function/) to accomplish this transformation.

Thus there are a couple of important ideas to keep in mind when writing your initialize implementation code:

- Your code will be running in its own scope, not the scope of the calling function. This means that what you have access to are your dependencies. This leads to code like React.useState rather than just useState.
- Since the code is evaluated at runtime, you don't have access to babel or other similar utilities. You should write your javascript for the widest use.
- You should not do anything that takes up too much processing time to initialize.
- You should expect your enhancer to be called multiple times for a single compose
- Your composer should not have any dependencies not explicitly listed

## Contributing

We welcome contributions. Whether its passing on an idea, adding code, writing your own set of enhancers, or telling us about a bug you found - together we can make this a better tool. Please see the [CONTRIBUTING.md](https://github.com/truefit/bach/blob/master/CONTRIBUTING.md) for guidelines.

Some Ideas To Get Started:

- Feedback on the process of creating custom enhancers
- Libraries around some popular hook collections like https://github.com/rehooks/ or https://github.com/rehooks/awesome-react-hooks

## Inspiration

In closing, we wanted to share some links that had effects on our thinking when putting this library together.

### Functional Programming

- [Composing Software](https://leanpub.com/composingsoftware)

### Other Libraries

- [Recompose](https://github.com/acdlite/recompose)
- [Rehook](https://github.com/Synvox/rehook)
- [Re-Enhance](https://github.com/cevr/re-enhance)
- [React Compose Hooks](https://github.com/lucasconstantino/react-compose-hooks)
- [react-hooks-composer](https://github.com/nudelx/react-hooks-composer)

### "Alternative" opinions on hook syntax

- https://medium.com/ottofellercom/can-react-hooks-api-replace-recompose-ea5460b7fde3
- https://stateofprogress.blog/the-biggest-lies-about-react-hooks-29aa306e354f
- https://medium.com/ackee/what-i-dont-like-about-react-hooks-e6ec7da863d5
- https://dev.to/revskill10/why-i-wont-use-react-hooks-i38
- https://www.reddit.com/r/reactjs/comments/9suobg/why_the_hate_for_react_hooks/
