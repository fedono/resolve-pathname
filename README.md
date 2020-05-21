
`index.js` 是 [resolve-pathname](https://github.com/mjackson/resolve-pathname) 的解析

## Usage
```js
import resolvePathname from 'resolve-pathname';

// Simply pass the pathname you'd like to resolve. Second
// argument is the path we're coming from, or the current
// pathname. It defaults to "/".
resolvePathname('about', '/company/jobs'); // /company/about
resolvePathname('../jobs', '/company/team/ceo'); // /company/jobs
resolvePathname('about'); // /about
resolvePathname('/about'); // /about

// Index paths (with a trailing slash) are also supported and
// work the same way as browsers.
resolvePathname('about', '/company/info/'); // /company/info/about

// In browsers, it's easy to resolve a URL pathname relative to
// the current page. Just use window.location! e.g. if
// window.location.pathname == '/company/team/ceo' then
resolvePathname('cto', window.location.pathname); // /company/team/cto
resolvePathname('../jobs', window.location.pathname); // /company/jobs
```

## 来源
- [resolve-pathname](https://github.com/mjackson/resolve-pathname)
  > 看 [history](https://github.com/ReactTraining/history) 源码的时候，看到了这个库，顺便看了下代码
