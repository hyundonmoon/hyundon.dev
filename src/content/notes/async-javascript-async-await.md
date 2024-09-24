---
title: "Asynchronous JavaScript: async/await"
pubDate: "2022-03-20"
summary: "Blurring the line between synchronous and asynchronous code with async/await"
language: "English"
---

For the past few weeks, I've been studying asynchronous programming in JavaScript. I found out that there are several different ways of handling asynchrony in JavaScript.

Traditionally, developers relied on _asynchronous callback functions_ to carry out asynchronous operations. However, this method wasn't ideal for complex asynchronous operations because it often required too many nested callbacks.

Introduced in ES2015, _Promises_ provide a way to chain multiple asynchronous operations in a readable format while ensuring that you can "catch" errors thrown during asynchronous operations. However, creating a long Promise chain can also make your code less readable since it requires multiple _then_ invocations and callback functions. Moreover, regular _try/catch_ blocks don't work with Promises, which leads to yet another _then_ invocation in the form of _catch_.

ES2017 introduced **async/await** to JavaScript to help mitigate these problems. _async/await_ blurs the line between synchronous and asynchronous code in JavaScript and represents a massive change in how JavaScript developers write code for asynchronous operations.

## async/await

**async/await** lets developers write asynchronous, non-blocking code as if it were a synchronous, blocking code. Asynchronous code that uses _async/await_ is much easier to read than its counterpart which uses a Promise chain. That isn't to say that _async/await_ does not use Promises. Any code that uses _async/await_ is still Promise-based. The only difference is that _async/await_ cleverly hides away the Promises so that the code ends up looking synchronous.

## async

Async functions are declared via the **async** keyword. Such functions **always** return a Promise object. Even if you explicitly return a value or throw an error from the function, the eventual outcome of the async function will be a Promise object. The Promise object will resolve to the value returned by the async function or reject with the exception thrown by the function.

If an async function that does not use the _await_ operator returns a non-Promise value, then the Promise object returned by that function will resolve synchronously. If the function returns a Promise, or includes any _await_ operators, the Promise object will always resolve asynchronously.

```javascript
const returnsPromise = async () => {
  return new Promise((resolve) => resolve("hi"));
};

const returnsSomethingElse = async () => {
  return 3;
};

const returnsSomethingElseWithAwait = async () => {
  return await 3;
};

const p1 = returnsPromise();
// resolves asynchronously
const p2 = returnsSomethingElse();
// resolves synchronously
const p3 = returnsSomethingElseWithAwait();
// resolves asynchronously

console.log(p1);
// Promise { <pending> }
console.log(p2);
// Promise { 3 }
console.log(p3);
// Promise { <pending> }
```

## await

The **await** operator can be used inside an async function. The _await_ operator literally "waits" for a Promise to settle. If the Promise fulfills, the value of the _await_ expression is the fulfillment value of the Promise. If the Promise rejects, then the _await_ operator will throw an error.

It's important to understand that the _await_ operator doesn't keep control of the main thread while waiting for the Promise to settle. If it did, that would just be a regular, synchronous operation. Instead, what really happens is that the _await_ expressions split up the async function body and turn it into a dynamically constructed Promise chain. Each chunk of code that follows an _await_ expression acts as the callback passed to the _then_ invocation on the "awaited" Promise that precedes it.

When the JavaScript interpreter finds an _await_ operator, it will temporarily stop executing the async function and return control to its caller. Then, once the "awaited" Promise settles and the call stack is empty, control returns to the async function, and execution continues from where it left off.

```javascript
// await expression syntax
// ReturnValue = await Promise/Thenable/ non-Promise value;

const outer = () => {
  console.log("synchronous function invoked...");
  const inner = async () => {
    console.log("async function invoked...");
    const p = await new Promise((resolve) => setTimeout(resolve, 0));
    console.log("inside inner");
  };

  inner();
  console.log("inside outer");
};

outer();
console.log("outside outer");

// synchronous function invoked...
// async function invoked...
// inside outer
// outside outer
// inside inner
```

In this example, we have a regular function (outer) and an async function (inner). When outer is invoked, a message ('synchronous function invoked...') is logged, _inner_ is declared and immediately invoked. When _inner_ is invoked, it synchronously logs a message ('async function invoked...') and runs into an _await_ expression. At this point, the Promise is created, and a timer is set. Control moves from the async function to its caller (outer), and the code that follows the async function is executed. Another message("insider outer") is logged, then control moves the caller of outer, and the next message is logged ('outside outer'). Now, since all code has been executed from the call stack and the "awaited" Promise has settled, control moves back to the async function. _p_ now holds the fulfillment value of the Promise (undefined) and the final message ('inside inner') is logged.

## Conclusion

Using _async/await_ makes it so much easier to work with asynchronous code in JavaScript. Using the _async_ keyword forces a function to 1) always return a Promise object, and 2) allow the usage of the _await_ operator within its function body. The _await_ operator splits up the function body into separate, synchronous pieces. When the async function is invoked, it momentarily stops execution at every _await_ expression and waits for the "awaited" Promise to settle. During this time, control returns to the caller, and code execution continues. Once the Promise settles, control returns to the async function, and execution continues from where it left off. If the Promise has fulfilled, the next chunk of code is executed. If the Promise is rejected, the _await_ operator throws an error.

By using _async/await_, JavaScript developers no longer have to create long Promise chains full of _then_ invocations and their callbacks. Asynchronous code using _async/await_ tends to be more readable and easier to wrap your head around.

---

### Works Cited

- Archibald, Jake. “Async Functions: Making Promises Friendly.” Web.dev, [web.dev/async-functions/](https://web.dev/async-functions/).

- “Async Function - Javascript: MDN.” JavaScript | MDN, [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

- “Asynchronous JavaScript.” JavaScript: The Definitive Guide, by David Flanagan, 7th ed., O'Reilly Media, 2020.

- “Await.” JavaScript | MDN, [developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
