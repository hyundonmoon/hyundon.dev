---
title: "Digging into React Hook Internals: A few things I learned about useState and other hooks"
pubDate: "2024-11-07"
summary: "Digging into React source code to understand why hook order matters and how useState initial values are managed."
language: "English"
---

I've been using React and React Hooks for a while now, and so far, I've taken all of its magic for granted. I've read the docs and tried to follow the "Rules of Hooks," but then I was left wondering why the React team decided to enforce such rules and why React Hooks work the way they do. The React docs didn't provide enough information to answer my questions so I decided to dig into the React source code. In this post, I'll share a few things I learned about React Hooks, specifically `useState`, and why the order in which hooks are called matters.

## Rules of Hooks

If you've read the React docs, you'll most likely have come across the [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning). If you haven't, then there's a good chance you'll have come across the warning message that React throws when you violate these rules. The Rules of Hooks are a set of guidelines that React enforces to ensure that hooks work properly. The rules include:

- Hooks should only be called at the top level of a function component or a custom hook.
- Hooks shouldn't be called inside loops or conditions.
- Hooks shouldn't be called after a conditional return statement.

For the most part, I just accepted these rules and tried to follow them without really understanding why they were in place. But after digging into the source code, I realized that these rules are crucial for the way React manages hooks and state updates.

### Hooks and Linked Lists

When a React Hook is invoked in a function component, React stores the hook as part of a linked list on the fiber object's `memoizedState` property. Specifically, this takes place via a function called `mountWorkInProgressHook`.

```javascript
// ziplink.at/R2RBdn
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

This function gets invoked every time a hook is called in a function component, when the component is rendered for the first time (i.e., mounted). If a hook is the first one to get called in that component, React initializes the 'memoizedState' property of that component's fiber object with the hook. Subsequent hooks get appended to the end of the list.

```javascript
// ziplink.at/h5RT0B
// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let currentHook: Hook | null = null;
let workInProgressHook: Hook | null = null;
```

I've read other blog posts on this topic and I noticed that most of them use arrays to explain how React stores hooks. [Preact](https://github.com/preactjs/preact/blob/07dc9f324e58569ce66634aa03fe8949b4190358/hooks/src/index.js#L136) also uses arrays to store hooks. I'm not sure if React changed their implementation at some point, but regardless of the data structure used, the key takeaway here is that the order in which hooks are called and stored matters.

The order matters because when a component gets re-rendered and the hooks are called again, React will call a different method, [`updateWorkInProgressHook`](https://github.com/facebook/react/blob/c3570b158d087eb4e3ee5748c4bd9360045c8a26/packages/react-reconciler/src/ReactFiberHooks.js#L1010) to retrieve the hooks from the fiber object. This method uses the previously created linked list to get the hooks in the same order in which they were called.

Calling hook in a conditional, or in a loop, or after a conditional return statement could potentially disrupt the order in which hooks are called. This would cause the linked list to be out of sync with the order in which the hooks are called. When you call hooks in a consistent order, React can maintain the hook list across renders and ensure that the state is maintained and updated correctly. This is why React forces you to call hooks in a consistent order and at the top level of your function components.

## useState and Initial Values

Another question that I had was how React manages the initial values passed to `useState`. The [docs](https://react.dev/reference/react/useState#parameters) mention that the initial value or initializer function passed to `useState` is used during the initial render and ignored afterwards. But how does that actually work?

```javascript
let state;

function useState(initialValue) {
  state = state || initialValue;

  function setState(newVal) {
    state = newVal;
  }

  return [state, setState];
}
```

If we imagine that React used an implementation as above, then the initialValue would indeed be ignored after a new value is set. But what if we were to assign a falsy value to state? In that case, the initial value would be used again in the next render.

Instead, React uses an approach that I honestly didn't expect. If you take a look at the source code for `useState`, you'll see that React calls a method of the same name on a dispatcher object.

```typescript
// ziplink.at/dPsdn7
export function useState<S>(
  initialState: (() => S) | S,export
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function resolveDispatcher() {
  const dispatcher = ReactSharedInternals.H;
  // ...
  return ((dispatcher: any): Dispatcher);
}
```

Interestingly, the value of the `ReactSharedInternals.H` object depends on the context in which a component is rendered.

```typescript
// ziplink.at/6D4D2o
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  // ...
): any {
  // ...
  if (__DEV__) {
    // ...
  } else {
    ReactSharedInternals.H =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount // Used during initial render
        : HooksDispatcherOnUpdate; // Used during subsequent renders
  }
  // ...
}

// ziplink.at/AgN1Qu
const HooksDispatcherOnMount: Dispatcher = {
  // ...
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
};

// ziplink.at/BCh_2K
const HooksDispatcherOnUpdate: Dispatcher = {
  // ...
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
};
```

When a function component that uses React Hooks is rendered for the first time, React sets the `ReactSharedInternals.H` object to `HooksDispatcherOnMount`. The `useState` method on this object refers to the `mountState` function which creates a new hook and initializes it with the initial value passed to `useState`.

```typescript
// ziplink.at/kaTeC4
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountStateImpl(initialState);
  // ...
}

function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  // ...
  if (typeof initialState === "function") {
    const initialStateInitializer = initialState;
    initialState = initialStateInitializer();
    // ...
  }
  hook.memoizedState = hook.baseState = initialState; // Initial value is used!
  // ...
}
```

When the same component is re-rendered, React sets the `ReactSharedInternals.H` object to `HooksDispatcherOnUpdate`. The `useState` method on this object refers to the `updateState` function. `updateState` receives the initial value or initializer function as argument and passes it on to the `updateReducer` function. But `updateReducer` doesn't do anything with the initial value or initializer function.

```typescript
// ziplink.at/_6zZrs
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, initialState);
}

function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  // Initial value is ignored!
  const hook = updateWorkInProgressHook();
  return updateReducerImpl(hook, ((currentHook: any): Hook), reducer);
}
```

This is how React ensures that the initial value is only used during the initial render and ignored afterwards. This behavior was something that I didn't expect and the fact that this happens for every hook that you use in your function components is quite surprising. I can't say for sure why React chose this approach, but I do feel like it is better than having to add multiple conditional checks in each hook to determine whether the component is being mounted or re-rendered. This approach also reminded me a bit of the Dependency Injection pattern that I really enjoyed using in Angular.

## Conclusion

Diving into the React source code was a great learning experience for me. I feel like I've come out of it with a deeper understanding of how React Hooks work. It took me a pretty long time to 1) actually find the relevant code and 2) understand what was going on, but it was well worth it. I was also absolutely delighted to find that React developers are like the rest of us and also leave comments like [these](https://github.com/facebook/react/blob/d1f04722d617600cc6cd96dcebc1c2ef7affc904/packages/react-reconciler/src/ReactFiberHooks.js#L1630) in their codebase.

I hope this post has given you some insight into how React Hooks work. If you're interested in learning more about React Hook internals, I highly recommend checking out the React source code on GitHub. You can also read some of the blog posts that I found helpful in my research. I've included links to them below.

## References

- Abramov, Dan. [How Does setState Know What to Do?][1]

- Abramov, Dan. [Making Sense of React Hooks][2]

- Facebook. [React source code][3]

- Wang, Shawn. [Deep dive: How do React hooks really work?][4]

[1]: https://overreacted.io/how-does-setstate-know-what-to-do/
[2]: https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889
[3]: https://github.com/facebook/react
[4]: https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
