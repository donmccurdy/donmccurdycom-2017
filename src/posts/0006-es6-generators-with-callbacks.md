---
title: Using ES6 Generators with Callback-based Libraries
slug: es6-generators-with-callbacks
date: 2015-08-07 04:00:00
layout: post.html
---

ES6 introduces generators (and `yield` expressions) to JavaScript. Kyle Simpson has written [a nice introduction to generators](http://davidwalsh.name/es6-generators), if you're looking for more about how they work.

They're a very welcome change from callbacks-of-infinite-sorrow situations, but generators aren't necessarily well supported by most NPM packages. Which raises the question:

### How do I use generators with callback-based libraries and older code?

I ran into this problem while trying out [Koa](http://koajs.com) (web framework, generators everywhere) and [node-sqlite3](https://github.com/mapbox/node-sqlite3) (database bindings with callbacks). Some NPM packages do come with generator support, but these are harder to find – and less likely to be stable – for a while yet. Let's take some older code relying on callbacks and wire it up with a generator.

Here's a basic fetch-things-from-a-database example:

```javascript
var db = new ArbitraryDB();

var gizmoService = {
    /**
     * List all Gizmos.
     */
    all: function () {
        db.all(function (error, result) {
            // [1] ???
        });
        // [2] ???
    }
};

// Application code.
// Let's protect this part from nasty callbacks.
var gizmos = gizmoService.all();
console.log(gizmos); // NULL
```

Well, that doesn't work. We need to return a value at `[2]`, but the callback at `[1]` hasn't been invoked yet. Native Promises (not polyfills, unfortunately) can solve this problem.

> NOTE: As of this writing, generators in NodeJS only work with the `--harmony` flag. I'm using NPM v0.12.0.

An updated example:

```javascript
var db = new ArbitraryDB();

var gizmoService = {
    /**
     * List all Gizmos.
     */
    all: function *() {
        // Return a new Promise
        return new Promise(function(resolve, reject) {
            db.all(function (error, result) {
                // ... and resolve or reject with the result.
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
};

// Application code.
var gizmos = yield gizmoService.all();
console.log(gizmos); // [ ... gizmos ... ]
```

Or, to catch possible DB-level errors:

```javascript
try {
    var gizmos = yield gizmoService.getAll();
} catch (error) {
    console.log('Oh, it broke.');
}
```

And that's it! The rest of your application can continue without worrying about the callbacks tucked away in a dependency.
