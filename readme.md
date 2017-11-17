# deep-eq
[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]


```js
const eq = require('deep-eq');

eq({foo: {ok: 1}}, {foo: {ok: 2}});
```

outputs: (colors not shown)
```sh
AssertionError:
 ↔ foo.ok: 1 !== 2
    at ....
```

[npm-image]: https://img.shields.io/npm/v/deep-eq.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/deep-eq
[travis-image]: https://img.shields.io/travis/caub/deep-eq.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/deep-eq
[codecov-image]: https://img.shields.io/codecov/c/github/caub/deep-eq.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/deep-eq
