---
title: "Static imports vs. Dynamic imports in JavaScript"
pubDate: "2023-08-19"
summary: "Comparing static and dynamic imports in JavaScript"
language: "English"
---

## Static imports (import declaration)

Static imports allow a module to introduce read-only bindings from another module into its local scope. These bindings can only be accessed, not modified, within the importing module.

Static imports are only allowed in modules (i.e., files interpreted as modules). To mark a file as a module, add **type="module"** (with double quotes) to the script tag that loads the file.

Static imports adhere to a number of syntactic rules. They are only allowed in top-level code (no functions or code blocks). Module specifiers passed to static imports must be a string literal, which means that variables and other expressions that evaluate to strings cannot be used. This allows important features such as static analysis, linking before evaluation, and tree-shaking. These rules also make modules asynchronous by nature and enable features such as top-level await.

## Dynamic imports

Dynamic imports allow a module to be loaded asynchronously and dynamically into an environment that does not necessarily have to be a module environment.

Dynamic imports are evaluated at runtime and have a more flexible syntax compared to static imports. The module specifiers used to import modules dynamically can also be constructed dynamically. Dynamic imports can be used inside blocks of code and functions.

Dynamic imports return a promise that fulfills to a namespace object. A namespace object is an object that contains all the exports of a module as properties. You can't assign a new value to a property of a module namespace object. This behavior mirrors that of live bindings created on static import. Changes made from the module that exports the object are reflected in those that import it.

Note that **import()** isn't a function call. It does not inherit from Function.prototype, so it's not possible to access properties such as call or apply. It cannot be aliased either, and attempts to assign import to a variable will result in a SyntaxError.

## References

- Bynens, M. (2017, November 21). Dynamic import(). V8. <https://v8.dev/features/dynamic-import>

- Import(). MDN. (n.d.-b). <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import>

- Import. MDN. (n.d.-a). <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import>
