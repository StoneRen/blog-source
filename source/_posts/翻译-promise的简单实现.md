---
title: '[翻译] promise的简单实现'
date: 2017-07-28 23:21:43
tags: [nodejs,js,promise,翻译]
---

本文对[https://www.promisejs.org/implementing](https://www.promisejs.org/implementing)进行了简单的翻译,各位看官慢慢端详.


## 介绍

本篇文章是作为[Stack Overflow](http://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244#23785244)的答案而写的.希望你通过了解如何在js中实现`Promise`,能让你更好的理解`promise`行为.

## 状态机

鉴于`Promise`就是一个状态机,我们应该先创建之后需要的状态信息

<!-- more -->

```js
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value or error once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers attached by calling .then or .done
  var handlers = [];
}
```

> 作者注:
> 其实指定状态的话,可以采用`ES2015`的[symbal](https://github.com/ruanyf/es6tutorial/blob/c9b9564ca69b229e4d3ed6ffc3e2caefe23ac6ed/docs/symbol.md)
> 修改代码为:

 ```
var PENDING = Symbol('PENDING');
var FULFILLED = Symbol('FULFILLED');
var REJECTED = Symbol('REJECTED');
 ```
 
 ## 状态转变
 下面让我们考虑两个会发生的状态转变,`FULFILLED`和`REJECTED`
 
 ```js
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }
}
 ```
 
 上面仅仅是一个低级的转换,让我们考虑一个额外的高等级的`resolve`.
 
 ```js
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise() {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }
}
 ```
 **注意:** `resolve`既可以接收一个`promise`对象也可以接收一个值.如果是`promise`对象,会等待他完成.一个`promise`不会完成另一个`promise`,所以暴露`resolve`函数,而不是在内部执行完成.`(A promise must never be fulfilled with another promise, so it is this resolve function that we will expose, rather than the internal fulfill)`.我们使用几种`helper`方法,定义如下:
 
```js
 /**
 * Check if a value is a Promise and, if it is,
 * return the `then` method of that promise.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
function getThen(value) {
  var t = typeof value;
  if (value && (t === 'object' || t === 'function')) {
    var then = value.then;
    if (typeof then === 'function') {
      return then;
    }
  }
  return null;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 *
 * @param {Function} fn A resolver function that may not be trusted
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}
```


## 构造

现在我们已经拥有完整的内部状态机,但是没有暴漏`resolve`方法和`监控`他的方法.让我们开始添加`resolve`方法.

```js
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  doResolve(fn, resolve, reject);
}
```
如你所见,我们重新调用了`doResolve`,因为我们有另一个不可信的`resolver`.`fn`允许多次调用`reject`和`resolve`,甚至抛出异常.这取决于我们能确保`promise`仅仅调用一次`resolved`或者`reject`,然后才能再次切换到不同的`state`.

## 监控 (通过`.done`)
现在,我们拥有完整的状态机,但是仍然没有观察可改变状态的方式.我们的终极目标是实现`then`,但是`.done`的语法更简单,所以我们先实现这个方法.

我们的目标是实现`promise.done(onFulfilled, onRejected)`,如下:
1. 仅调用一次`onFulfilled`和`onRejected`
2. 本身只了调用一次
3. 在下一次`tick`(比如`.done`已经返回了)前不会被调用
4. 在`promise``resolve`之前或者调用`.done`之后再进行调用

```js
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
  // store state which can be PENDING, FULFILLED or REJECTED
  var state = PENDING;

  // store value once FULFILLED or REJECTED
  var value = null;

  // store sucess & failure handlers
  var handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result) {
    try {
      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
    } else {
      if (state === FULFILLED &&
        typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(value);
      }
      if (state === REJECTED &&
        typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {
    // ensure we are always asynchronous
    setTimeout(function () {
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }, 0);
  }

  doResolve(fn, resolve, reject);
}
```
当`promise`对象`resolve`或者`reject`之后,我们要保证通知处理程序.我们会在下一次`tick`中作此操作.

## 监控(通过`.then`)
现在我们已经实现了`.done`,然后仅仅通过相同的操作来简单的实现`.then`,但在此过程中构造了一个新的`promise`对象

```js
this.then = function (onFulfilled, onRejected) {
  var self = this;
  return new Promise(function (resolve, reject) {
    return self.done(function (result) {
      if (typeof onFulfilled === 'function') {
        try {
          return resolve(onFulfilled(result));
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return resolve(result);
      }
    }, function (error) {
      if (typeof onRejected === 'function') {
        try {
          return resolve(onRejected(error));
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return reject(error);
      }
    });
  });
}
```

## 进一步阅读
[then/promise](https://github.com/then/promise/blob/master/src/core.js) 比较简单的方式实现`Promise`
[kriskowal/q](https://github.com/kriskowal/q/blob/v1/design/README.js) 非常不同的`promise`实现方式,背后拥有非常良好的设计原则.
[petkaantonov/bluebird](https://github.com/petkaantonov/bluebird) 为性能优化而生的`promise`实现
[Stack Overflow](http://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/23785244#23785244) 本篇文章来源于此