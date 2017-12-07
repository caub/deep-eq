# deep-eq
[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

## Why?
- `assert.deepEqual` [doesn't display well](https://github.com/nodejs/node/issues/15696) the diff between 2 objects
- simple: no transpiling needed

```js
const eq = require('deep-eq');

eq({foo: {ok: 1}}, {foo: {ok: 2, u: 0}});
```

outputs: (colors not shown, key and values (left/right) have different colors)
```sh
AssertionError:
foo.ok 1	foo.ok 2
        	foo.u 0
    at ....stacktrace...
```


[npm-image]: https://img.shields.io/npm/v/deep-eq.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/deep-eq
[travis-image]: https://img.shields.io/travis/caub/deep-eq.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/deep-eq
[codecov-image]: https://img.shields.io/codecov/c/github/caub/deep-eq.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/deep-eq
