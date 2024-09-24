---
title: "JavaScript module specifiers"
pubDate: "2023-07-29"
summary: "Exploring JavaScript's module specifier types and how they're interpreted across different environments"
language: "English"
---

# Module specifiers

## What is a module specifier?

A module specifier is a string used in JavaScript to identify and locate a module. It points to the module file, enabling the JavaScript environment to resolve and load the module when it is imported.

## Types of module specifiers

The following are are module specifier patterns commonly found in JavaScript module files.

### Relative path

Module specifiers that use relative paths start with a dot and refer to module files relative to the current file's location.

```javascript
"./dir1/dir2/module.js";
```

### Absolute path

Module specifiers that use absolute paths start with a slash and refer to a module file with an absolute file path.

```javascript
// no dot!
"/dir1/dir2/module.js";
```

### URL

Module specifiers that use URLs start with a protocol such as "https://" or "file://" and refer to module files with a complete URL.

```javascript
"file:///home/hyundon/javascript/module.js";
```

### Bare module specifiers

Bare module specifiers is a type of module specifier that is not a relative path, an absolute path, or a URL. It does not begin with a dot, a slash, or a protocol and does not include a file extension. It is a single name that refers to a module file.

```javascript
import _ from "lodash";
```

## Differences in module specifier resolution

Before ES6, JavaScript had no built-in module system. JavaScript runtime environments (e.g., browsers, Node.js) adopted different module systems and each environment has its own module specifier resolution algorithm.

A notable difference between the algorithms employed by browsers and Node.js is the way in which they resolve bare module specifiers. In Node.js, bare module specifiers are supported out of the box and they are interpreted as npm package names. They are resolved relative to the closest "node_modules" directory.

In contrast, by default, browsers do not support bare module specifiers. Browsers need _import maps_ to resolve bare module specifiers. Import maps map bare module specifiers to URLs that browsers recognize. Alternatively, bare module specifiers could be transpiled via development tools such as bundlers into a format that the browser understands.

---

### Works Cited

- Clark, L. (2018, March 28). Es modules: A cartoon deep-dive. Mozilla Hacks. <https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/>
- Huang, Y. (2023, February 23). JavaScript import maps, part 1: Introduction. SpiderMonkey. <https://spidermonkey.dev/blog/2023/02/23/javascript-import-maps-part-1-introduction.html>
- JavaScript modules. MDN. (n.d.). <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>
- Osmani, A., &amp; Bynens, M. (2018, June 18). JavaScript modules. V8. <https://v8.dev/features/modules>
- Rauschmayer, A. (n.d.). Modules. JavaScript for impatient programmers. <https://exploringjs.com/impatient-js/ch_modules.html#module-specifiers>
