---
title: "Variables in JavaScript"
pubDate: "2021-12-21"
summary: "Understanding the differences between variables declared via var, let, and const."
language: "English"
---

Before ES6, the var keyword was the only way of declaring variables in JavaScript. As such, you will most likely come across variables declared via var in courses, books, and code that predate ES6. However, almost all post-ES6 code prefers the let and const keywords rather than var. In fact, most of the materials that I used to study this topic discouraged students from ever using var when coding.

In this article, I will go over the differences between variables declared via var, let, and const and why the use of var is no longer encouraged.

## var, let, const

Variables in JavaScript can be declared with var, let, and const keywords. Variables declared with each keyword demonstrate noticeable differences that will affect your code. Let's first look at their basic characteristics and differences.

### var

var is the oldest among the three keywords and has been around since the birth of JavaScript. You can declare a variable with the var keyword and assign a value at the same time to immediately initialize the variable. If needed, the declaration and assignment may occur in separate steps. The value of uninitialized variables is undefined.

Variables declared with var are mutable. This means that it is possible to modify the binding between a variable name and a variable value. It is also somewhat strangely legal to redeclare the same variable with the var keyword.

```javascript
var currentShoes = "Chuck 70";
currentShoes = "Converse";
// mutable

var currentWatch;
currentWatch = "Casio A700WM-7A";
// can be declared and assigned a value separately

var currentShoes = "Nike";
// redeclared without problems!
```

### let

In modern JavaScript, the let keyword has essentially replaced the var keyword. Just like the var keyword, variables declared via let are mutable. These variables may be initialized immediately or in separate steps. However, unlike var, redeclaring a variable with the let keyword will result in a SyntaxError.

```javascript
let browser = "Firefox";
browser = "Firefox 95.0.2";
// mutable

let viewing;
viewing = "My blog";
// can be declared and assigned a value separately

let browser = "Chrome";
// SyntaxError: Identifier 'browser' has already been declared
```

### const

The const keyword offers a way to declare constants in JavaScript. A variable declared via const is immutable. In other words, it is impossible to alter the binding between a variable name and a variable value. It's worth noting that this does not mean that the value itself is also immutable. In the case of objects, it is possible to modify the stored data value, as long as you do not reassign a new value to the variable.

Unlike let and var, const variables must be initialized immediately. It wouldn't make much sense to initialize a constant to undefined, only to reassign a value later on. That would go against the very definition of a constant.

```javascript
const phone = 'Android';
phone = 'Apple';
// TypeError: Assignment to constant variable.

const headphone;
// SyntaxError: Missing initializer in const declaration

const wallet = {};
wallet.description = "Bought from a shop in Thailand"
// modifying the data value through its memory address so no problems here!
```

## Scope

Another crucial difference between variables declared via var, let, and const is how they are scoped. The scope of a variable represents the area in a program in which it is accessble. Variables are accessible from their scopes and any nested scopes within that scope. Variable scopes are statically defined, which is to say that the source code has the final say on how a variable is scoped.

There are several types of scopes in JavaScript. The most relevant to this topic are function and block scopes. Function definitions create their scope and any variable created with var, let, and const can only be referenced within the function scope. Any reference to that specific variable from outside will return a ReferenceError.

```javascript
function hello() {
  var greeting = "Hello!";

  function greet() {
    let firstName = "Hyun Don";
    const lastName = "Moon";
    console.log(`${greeting} ${firstName} ${lastName}!`);
    // greeting, firstName, lastName are in scope
  }
  greet();
}
hello();
// Hello Hyun Don Moon!
console.log(`${greeting} ${firstName} ${lastName}!`);
// ReferenceError: greeting, firstName, lastName are not defined (out of scope)
```

Blocks of code also create scopes in JavaScript. Examples of code blocks in JavaScript include function and class definitions, if/else statements, and while/for loops. Even a pair of braces will define a scope for variables defined within it. Variables defined within code blocks are scoped to the closest surrounding scope.

```javascript
{
  var a = "Do I live here?";
  let b = "I live here";
  const c = "I live here too";
}
console.log(a);
// Do I live here?
console.log(b);
// ReferenceError: b is not defined
console.log(c);
// ReferenceError: c is not defined
```

As you can see, variables declared with let and const are scoped to the pair of curly braces and cannot be referenced outside the scope. However, variable a is accessible outside the curly braces. We can reference the variable because variables declared with var are function scoped. 'var variables' are scoped to the closest surrounding function scope which is why 'console.log(a)' works.

Before ES6 (i.e., before let and const), JavaScript only supported function scope since the var keyword was the only way of declaring variables. Thanks to the let and const keywords, modern JavaScript now supports block scope. Variables declared with let and const are block-scoped and are accessible only within their corresponding scopes.

Another difference worth noting has to do with the global scope. Global scope refers to the outermost scope of a program, and global variables are accessible from anywhere. Global variables declared via var are added as properties to the global object. However, global variables declared with let and const are not added to the global object.

```javascript
// global variables
var globalVarOne = "added";
let globalVarTwo = "not added";
const globalVarThree = "not added";

console.log(globalThis.globalVarOne);
// added
console.log(globalThis.globalVarTwo);
// undefined
console.log(globalThis.globalVarThree);
// undefined
```

## Hoisting & Temporal Dead Zone

Hoisting is an interesting feature of JavaScript that has to do with variable activation. As we've seen before, scope refers to the area in which a variable is accessible. Activation, on the other hand, has to do with when we can access the variable without running into errors. In JavaScript, variables declared via var are "hoisted" up to the top of the scope. It is almost as if the variable declaration were to occur at the top of the scope, while assignment occurs where you wrote it. This means that you can actually access variables declared with var before their declaration without errors. Of course, since the actual assignment occurs after the declaration, you would only get back undefined as its value.

Variables declared with let and const behave differently. As with variables declared with var, the JavaScript engine is aware of let and const variables even before their declaration. But there is a gap between entering a variable's scope and the variable declaration where the variable is not accessible. This gap is known as the temporal dead zone(TDZ). During this gap, let and const variables are considered uninitialized. The variables are initialized once their declarations are executed.

Unlike variables declared with var, trying to access a variable declared with let or const before its declaration (i.e., in the TDZ) will result in a ReferenceError. The error message will state that it is impossible to access the variable before initialization. If you tried to access a variable that doesn't exist, it would throw a ReferenceError saying that the variable is not defined.

```javascript
// what happens when we try to access variables a, b, c before they are declared?

function scope() {
  // Accessible but uninitialized
  console.log(a);
  // undefined

  // Temporal Dead Zone
  console.log(b);
  // Uncaught ReferenceError: Cannot access 'b' before initialization
  console.log(c);
  // Uncaught ReferenceError: Cannot access 'c' before initialization
  console.log(d);
  // Uncaught ReferenceError: d is not defined

  // function scope
  var a = "a";
  let b = "b";
  const c = "c";
}
```

## Conclusion

To sum up, there are several differences between variables declared via var, let, and const. Variables declared with var are mutable and may be redeclared. These variables are function-scoped and are accessible from the beginning of their scope.

Variables declared via let are mutable, while those declared with const are not. It is impossible to redeclare either let or const variables. They are both function-scoped and are only accessible after declaration.

---

### Works Cited

- “Functions for the Master: Closures and Scopes.” Secrets of the JavaScript Ninja, by John Resig et al., 2nd ed., Manning, 2016.

- “Types, Values, and Variables.” JavaScript: The Definitive Guide, by David Flanagan, 7th ed., O'Reilly Media, Inc., 2020.

- “Variables and Assignment.” JavaScript for Impatient Programmers, by Axel Rauschmayer, McGraw-Hill Education, 2019.

- “Variables: Scopes, Environments, and Closures.” Speaking JavaScript, by Axel Rauschmayer, O'Reilly Media, Inc., 2014.
