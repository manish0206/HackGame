[![NPM Version](http://img.shields.io/npm/v/git-toplevel.svg?style=flat)](https://npmjs.org/package/git-toplevel)
[![Build Status](http://img.shields.io/travis/royriojas/git-toplevel.svg?style=flat)](https://travis-ci.org/royriojas/git-toplevel)

# git-toplevel
> Method to find the top level git directory

## Install
```bash
npm i --save git-toplevel
```

## Usage
```javascript
var gitTopLevel = require('git-toplevel');

gitTopLevel().then(function(dir) {
  // dir ===> the git root 
}).catch(function(err) {
  // err ===> any error that happen when trying to get the top level dir
});
```

## Lincense

MIT

## [Changelog](./changelog.md)