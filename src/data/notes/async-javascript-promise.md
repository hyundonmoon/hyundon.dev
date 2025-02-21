---
title: "Asynchronous JavaScript: Promises"
pubDate: "2022-03-09"
summary: "A look into Promise-based asynchronous programming in JavaScript"
language: "English"
---

## Pre-ES6

Traditionally, JavaScript developers had to rely on callbacks to carry out asynchronous operations. Asynchronous callbacks are passed as arguments to functions that execute asynchronous code. The callback function is invoked after the asynchronous code is executed and specified conditions are met.

Asynchronous callbacks are practical when handling simple asynchronous operations. However, callbacks have to be nested within one another to implement a "chain" of callbacks, making your code a lot harder to read ([callback hell/pyramid of doom](http://callbackhell.com/)). Errors can occur at any stage of the asynchronous operation, which means that each callback of the "chain" needs its own error handler.

Promises offer an alternative to callbacks when handling asynchronous operations in JavaScript. Promises are now an essential part of asynchronous programming in web development because they make it much easier to register multiple callbacks on an asynchronous operation. Moreover, Promises also simplify error handling in asynchronous operations while offering a standardized way to handle asynchronous errors.

## Promises

A Promise represents the eventual outcome of a single asynchronous operation. A Promise is an object which holds information regarding the asynchronous operation. It also contains methods that we can use to register callbacks that will be invoked when the asynchronous operation terminates.

### states

During its lifetime, a Promise can be in one of three states: **fulfilled**, **rejected**, or **pending**. These states are mutually exclusive, meaning that a Promise can be in a single state at a time.

- A Promise is _fulfilled_ if the function associated with the Promise has succeeded and returned a non-Promise value.
- A Promise is _rejected_ when the function associated with the Promise has failed.
- A Promise is _pending_ if the Promise has not been fulfilled or rejected yet.

A _settled_ Promise is a Promise that has either been fulfilled or rejected. A Promise that has settled cannot change its state and will always remain in that state.

### resolved/rejected

You may also come across the term _resolved_ when working with Promises. It is often used interchangeably with _fulfilled_," but a resolved Promise does not necessarily mean a fulfilled Promise.

A Promise is resolved if 1) it has _settled_, or 2) it is "tracking" the state of another Promise. A Promise (p) that is currently tracking the state of another Promise (q) which has not settled is resolved but still _pending_. When Promise q settles, then Promise p will also settle with the same value.

If a Promise is rejected directly, or an unhandled exception occurs, then the Promise is _rejected_. A Promise is also rejected if it resolves to a Promise that eventually rejects or has already been rejected.

Note that the "tracking" is recursive. A Promise that resolves to another Promise which resolves to yet another Promise that eventually rejects is also rejected.

## Creating Promises

### Promise constructor

The Promise constructor creates and initializes a new Promise object. It must be called as a constructor function, and invoking it as a regular function will throw an exception.

The Promise constructor accepts a single executor function as argument. The executor function is used to initiate and handle the operation associated with the newly created Promise. Passing in anything other than a function object to the Promise constructor will result in a TypeError.

The executor function expects to receive a **resolve** function and a **reject** function as arguments. These functions are able to resolve or reject the associated Promise. The _resolve_ and _reject_ functions may be used within the executor function to alert the user of the eventual outcome of the asynchronous operation.

Both _resolve_ and _reject_ functions accept a single argument. The value passed to the _resolve_ function represents the eventual outcome of the Promise. The value passed to the _reject_ function represents the rejection value of the Promise.

When the Promise constructor is properly called, it will provide the required arguments to the executor function. Then, it will return a newly created Promise object whose fate lies in the hands of the executor function. Note that the executor function will be invoked **synchronously** which means that any synchronous code within the executor will block the execution of any subsequent code!

```javascript
let start, end;

function getResolvedPromise() {
  return new Promise((resolve, reject) => {
    console.log("Initiating Promise...");
    start = new Date();
    let counter = 0;

    for (let i = 0; i < 99_999_999; i++) {
      // blocking
      counter += Math.log(i);
    }

    resolve("Promise resolved!");
    reject("This is ignored");
    resolve("This is also ignored");
    end = new Date();
  });
}

const promise = getResolvedPromise();
const elapsedSeconds = Math.floor((end - start) / 1000);
console.log("Elapsed seconds: ", elapsedSeconds);
console.log("fin");

// Initiating Promise...
// Elapsed seconds:  7
// fin
```

### Promise.resolve, Promise.reject

**Promise.resolve** and **Promise.reject** are static methods of the Promise constructor that can create new Promise objects.

**Promise.resolve** takes a single, optional argument and returns a Promise resolved with the given argument. If the argument is a Promise object, _Promise.resolve_ returns the argument itself. If the argument is not a Promise, but a _thenable_ (a promise-like object that has a _then_ method), _Promise.resolve_ returns a newly created Promise object that adopts the future outcome of the _thenable_. If the argument is not a Promise nor a _thenable_, _Promise.resolve_ returns a Promise object fulfilled with the argument value. If no argument is given, _Promise.resolve_ returns a Promise fulfilled with _undefined_.

```javascript
const p1 = Promise.resolve(Promise.resolve("Promise resolved!"));
const p2 = Promise.resolve({
  then: (resolve) => resolve("Thenable resolved!"),
});
const p3 = Promise.resolve("Non-thenable value resolved!");

console.log(p1 instanceof Promise); // true
console.log(p2 instanceof Promise); // true
console.log(p2 instanceof Promise); // true

p1.then(console.log);
p2.then(console.log);
p3.then(console.log);

// Promise resolved!
// Non-thenable value resolved!
// Thenable resolved!
```

**Promise.reject** creates a new Promise that is rejected with the given argument. You can pass anything to _Promise.reject_ but passing an Error object is recommended as it can help with debugging and error catching.

```javascript
const p1 = Promise.reject("Rejected!");
const p2 = Promise.reject(Promise.resolve("Also rejected!"));
const p3 = Promise.reject(new Error("Error!"));

p1.catch(console.log); // Rejected!
p2.catch(console.log); // Promise { 'Also rejected!' }
p3.catch(console.log); // Error: Error! at <anonymous>:3:27
```

## Chaining promises with then()

One of the benefits of using Promises over callbacks is that Promises let you assemble a series of asynchronous operations in a linear fashion. If you were to create a chain of asynchronous operations using async callbacks, you would have to nest the callbacks one after another. In contrast, Promises provides the **then()** method, which you can use to register callbacks on Promises linearly without nesting callbacks inside the previous one.

### then()

The _then()_ method is a property of the Promise object that can register callbacks on a Promise. _then()_ accepts two optional arguments: a callback that will be invoked if the Promise fulfills, and another that will be invoked if the Promise rejects.

The first argument of _then()_ is invoked when the Promise is fulfilled (_onFulfilled_). The second argument is invoked when the Promise is rejected (_onRejected_). Both callbacks receive the eventual outcome of the Promise as argument. _onFulfilled_ receives the fulfillment value of the Promise, whereas _onRejected_ receives the rejection reason of the Promise.

```javascript
const resolvedPromise = Promise.resolve("Resolved!");
const rejectedPromise = Promise.reject("Rejected!");

resolvedPromise.then((value) => console.log("Callback invoked. ", value));
// Callback invoked.  Resolved!
rejectedPromise.then(
  (value) => console.log("Not invoked"),
  (error) => console.log("Callback invoked. ", error),
);
// Callback invoked.  Rejected!
```

Each invocation of the then() method returns a new Promise. The new Promise object will also have access to _then()_, which means that another set of callbacks can be registered on the new Promise object. Each _then()_ method invocation will return a new Promise object, creating a linear chain of Promises. The callbacks passed to each _then()_ invocation will be invoked sequentially, in the order in which they were registered.

The Promise object (p1) created by _then()_ resolves with whatever is returned from a callback passed to _then()_. As we've seen previously, a Promise that is _resolved_ is not necessarily the same thing as a Promise that has _fulfilled_. If a callback passed to _then()_ returns a value that is not a Promise, then p1 fulfills with that value immediately. However, if the callback returns a Promise (p2), then p1 resolves to p2 and begins to track p2's state. p1 settles to the eventual outcome of p2.

When a callback passed to _then()_ returns a Promise, this Promise is dynamically inserted into the Promise chain. Once the Promise settles, the next callback will receive the fulfillment value or reject reason for this Promise.

```javascript
const p1 = Promise.resolve("p1");
p1.then((value) => {
  // then() creates promise p2
  // p2 fulfills with 'p1'
  return value;
})
  .then((value) => {
    // then() creates promise p3
    // onFulfilled returns promise p4
    // p3 resolves to p4
    return Promise.resolve("p4");
  }) // p4 is dynamically inserted here
  .then((value) => {
    // this callback receives the fulfillment value of p4
    console.log(value);
    // p4
  });
```

A _then()_ invocation is synchronous. However, it is imperative to recognize that all callbacks passed to _then()_ are **always** invoked asynchronously. Even if you register a callback on a Promise that has already settled, the callback will be invoked after all the code that is currently in the event loop is executed. This behavior ensures that your code works in a predictable fashion.

## Handling errors with catch()

Another benefit of using Promises is that Promises provide a better way to handle errors thrown by asynchronous operations.

Asynchronous errors are handled differently from errors thrown by synchronous operations. When a synchronous function throws an error, it propagates through the call stack until it finds a catch block. This behavior does not work for asynchronous operations because the caller function would not be in the call stack when the asynchronous operation is executed.

Asynchronous tasks are invoked after the call stack is empty and the code in the current loop of the event loop is fully executed. This means that when an asynchronous function is invoked, its caller will already have been popped off the call stack. As such, if an error occurs during an asynchronous operation, it will not have access to its caller nor the catch block to handle it.

Traditionally, callback error handlers were used to take care of errors thrown by asynchronous operations. However, this was not an ideal solution as every nested callback function required its own error handler function, which exacerbated the mess created by the nested functions.

### catch()

Thanks to the introduction of Promises in ES6, we now have a much simpler and more efficient way of handling asynchronous errors. In a chain of Promises, errors propagate through the chain, instead of the call stack. We can use the _catch()_ method available on Promise objects to "catch" the error and deal with it.

The _catch()_ method is another way of expressing _then(null, onReject)_.

```javascript
const rejectedPromise = Promise.reject("rejected");
rejectedPromise.then(null, (reason) => console.log(reason)); // a
rejectedPromise.catch((reason) => {
  console.log(reason);
}); // b
// a and b are the same code
```

Although you could certainly pass an error handler function to _then()_, it is usually more practical to use _catch()_. _catch()_ can handle

```javascript
const resolvedPromise = Promise.resolve("resolved");
const rejectedPromise = Promise.reject("rejected");

const onFulfill = () => {
  throw "Error in onFulfill";
};
const onReject = () => console.log("Error handled");

resjectedPromise.then(onFulfill, onReject);
// Error handled
resolvedPromise.then(onFulfill, onReject);
// Uncaught (in promise) Error in onFulfill

resolvedPromise.then(onFulfill).catch(onReject);
// Error handled
rejectedPromise.then(onFulfill).catch(onReject);
// Error handled
```

Passing _onFulfill_ and _onReject_ as arguments to the _then()_ invoked on rejectedPromise will handle the error without problems. However, _onReject_ can't handle the error thrown by _onFulfill_.

This can be avoided by using _catch()_. By adding _catch(onReject)_ behind _resolvedPromise.then(onFulfill)_, we can handle the error thrown by onFulfill. Moreover, adding _catch(onReject)_ behind _rejectedPromise.then(onFulfill)_ will handle the rejection reason of _rejectedPromise_.

If _then()_ does not have the appropriate callback to handle a settled Promise, the Promise created by _then()_ will settle with the state of the Promise on which _then()_ was invoked. As such, the Promise returned by _rejectedPromise.then(onFulfill)_ will reject with the string "rejected" (the rejection reason of rejectedPromise). Then, _catch(onReject)_ will receive that rejected Promise and handle the error.

It's worth remembering that _catch()_ is just a shorthand for _then(null, callback)_. This means that _catch()_ also returns a new Promise object, and it is possible to register _then()_ on that Promise object. You can use _catch()_ to stop the error from propagating down the chain. This means that you can strategically place _catch()_ within the Promise chain to recover from errors and allow the chain to move on even in the case of errors.

```javascript
const rejectedPromise = Promise.reject("rejected");
const onReject = () => "it's ok!";

rejectedPromise.catch(onReject).then((value) => console.log(value));
// it's ok!
```

## Handling multiple asynchronous operations with Promise.all

Using a Promise chain to carry out asynchronous operations is great but sometimes you need the results of multiple asynchronous operations at once. **Promise.all()** provides a way to run multiple asynchronous operations in parallel. _Promise.all()_ takes an array of Promises as input and returns a newly created Promise. The new Promise will fulfill with an array of fulfillment values or reject with the rejection reason of the first rejected Promise. Note that the Promise object created by _Promise.all()_ will reject as soon as an input array element rejects, regardless of the state of other input Promises.

Technically, the _Promise.all()_ input array may contain non-Promise values. In such a case, the value becomes the fulfillment value of a resolved Promise object.

The Promise object returned by _Promise.all()_ will resolve asynchronously, as long as the given input is not an empty array. If an empty array is passed to _Promise.all()_, the newly created Promise will resolve to an empty array synchronously.

```javascript
const p1 = Promise.all([1, 2, 3]);
const p2 = Promise.all([Promise.resolve("resolved")]);
const p3 = Promise.all([]);

console.log(p1);
// Promise { <pending> }
console.log(p2);
// Promise { <pending> }
console.log(p3);
// Promise { [] }

setTimeout(console.log, 0, p1);
setTimeout(console.log, 0, p2);

// after call stack is empty,
// Promise { [ 1, 2, 3 ] }
// Promise { [ 'resolved' ] }
```

## Common mistakes

There are some common mistakes to watch out for when using Promises.

### Not returning from a callback

_then()_ returns a Promise that resolves with the callback function's return value. The callbacks waiting at the next stage of the chain can access that value to carry out the subsequent operations. If you do not return anything from the callback, the Promise will fulfill with _undefined_ as its fulfillment value. This could cause issues because the Promise object returned by _then()_ could be fulfilled while an asynchronous operation is still running in the background. The callback at the next stage of the chain would begin since the Promise is fulfilled, but it would not know whether the asynchronous operation of the previous stage has been fully executed.

Of course, you might not need anything at the next stage of the chain. However, it is practical to return some value from a callback passed to _then()_ to ensure that your code remains predictable.

### Unnecessary nesting

Promises provide a way to escape from the callback hell/pyramid of doom. That being said, it's easy to mistakenly create a nested chain of Promises that ends up being just as hard to read as the callback/hell.

```javascript
p1.then(
  () => p2.then(
    () => p3.then(
      () => promise4.then(...)
    )
  )
)
```

Promise chains that look like this completely miss the point of using Promises in the first place. By returning properly from callbacks, you can create a linear Promise chain that is much easier to read.

---

## References

- Archibald, Jake. [“JavaScript Promises: An Introduction”][1]

- “Asynchronous JavaScript.” JavaScript: The Definitive Guide, by David Flanagan, 7th ed., O'Reilly Media, 2020

- Denicola, Domenic. [“States and Fates”][2]

- Lawson, Nolan. [“We Have a Problem with Promises”][3]

- ECMAScript® 2022 Language Specification. [“Promise Objects”][4]

- MDN. [“Promise.resolve()”][5]

- MDN. [“Using Promises”][6]

[1]: https://web.dev/i18n/en/promises/
[2]: https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
[3]: https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
[4]: https://tc39.es/ecma262/#sec-promise-objects
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
[6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises