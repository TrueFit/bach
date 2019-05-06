# @truefit/bach

**This library is NOT ready for release yet, use with extreme caution**

## What is it

Bach is a utility library that functions as a composer for React components. The central tenet is that components should be focused on rendering, allowing other concerns to be coded elsewhere and passed in.

The goal is to help create a codebase that is readable, flexible, testable, and maintainable. In our experience, following this convention generally leads to a collection of single use, small functions that can easily be shared across a codebase.

## How to get started

### Install

```
npm install @truefit/bach
```

or

```
yarn add @truefit/bach
```

### Basic Composition

```
import React from 'react';
import {compose} from '@truefit/bach';

const Component = ({handleClick}) => (
  <div>
    <button onClick={handleClick}>
      Click Me
    </button>
  </div>
);

export default compose(
  withHandlers({
    handleClick: () => {
      alert('Hello There');
    },
  }),

  Component,
);
```

### Other helpers

TODO

### Creating your own helpers

TODO

## Hey, isn't this just Recompose

[Recompose](https://github.com/acdlite/recompose) is definitely a large inspiration for Bach. The big difference is that the internal workings of Bach are based on React Hooks, rather than purely HOCs like Recompose was.

As users of recompose we definitely were influenced by the syntax of recompose and the style of code it allowed to be created. That said, since the author of recompose has decided to deprecate it in favor hooks, we had to find another way forward.

You can read more about the fate of recompose here: https://github.com/acdlite/recompose/issues/756#issuecomment-438674573).

## Why not just use straight hooks

_TLDR: We think composing a component is more readable than hooks and we value readability highly_

Hooks were introduced in the fall of 2018 (https://www.youtube.com/watch?v=dpw9EHDh2bM) and they took the React community by storm (perhaps too fast in our opinion to be fully vetted </soapbox>). For good or for ill, hooks are definitely part of the future of React. In case you are here, and haven't done much with hooks yet, watch the video and read Dan Abromov's article here (https://dev.to/dan_abramov/making-sense-of-react-hooks-2eib).

While an exciting advance, the syntax of hooks leaves a lot to be desired imo, and we aren't alone:

- https://medium.com/ottofellercom/can-react-hooks-api-replace-recompose-ea5460b7fde3
- https://stateofprogress.blog/the-biggest-lies-about-react-hooks-29aa306e354f
- https://medium.com/ackee/what-i-dont-like-about-react-hooks-e6ec7da863d5
- https://dev.to/revskill10/why-i-wont-use-react-hooks-i38
- https://www.reddit.com/r/reactjs/comments/9suobg/why_the_hate_for_react_hooks/

In short, the standard React implementation of hooks creates side effects that aren't natural for functional programming. They introduce a "magic" that requires special knowledge. In both of the references above, Dan actually acknowledges this fact, but waives it off - we aren't willing to join him in doing so.

## What about ...

### HOC Hell

Overall, we took a different approach than most other "post recompose" libraries. Rather than continue down the path of pure HOC trees (which fall prey to HOC Hell referenced in pro-hook articles), we try to have the best of both worlds. We allow the users of this library to get the benefit of code readability through composition, while generating a resultant "condensed" component that follows React's rules for using hooks. While admittedly this is a little black magic, we think it proves very useful across a code base.

### Other Implementations

- [Rehook](https://github.com/Synvox/rehook)
  - We actually started using this library as we transitioned away from recompose. That said, the author has expressed that he views it as a "patch" for legacy code rather than a continuing library.
- [React Compose Hooks](https://github.com/lucasconstantino/react-compose-hooks)
- [Re-Enhance](https://github.com/cevr/re-enhance)
- [react-hooks-composer](https://github.com/nudelx/react-hooks-composer)

### I'm convinced, now what

- https://github.com/rehooks/
- https://github.com/rehooks/awesome-react-hooks
