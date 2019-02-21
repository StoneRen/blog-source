---
title: '[翻译] Async and Await (下)'
date: 2017-08-17 22:31:55
tags: [nodejs,javascript,async,await,'callback hell',翻译,promise]
---

> 原文地址:[async and await](https://zeit.co/blog/async-and-await)
> 书接上文 [[翻译] Async and Await (上)]()


## 未来: `async`和`await`

作为c#和f#中的常见的关键字,我们有一个灵巧的解决方案处理我们的问题:

```js
export default async function getLikes () {
  const users = await getUsers();
  const filtered = await filterUsersWithFriends(users);
  return getUsersLikes(filtered);
}
```
要想让代码起作用,我们需要确定处理I/O的函数(比如`getUsers`)返回的是`Promise`对象.   
不仅易读(比起链式调用),而且现在错误处理可以与js正常的同步代码完全一致.   
也就是说,当我们`await`一个函数时,会出现错误(如果有)并抛出.如果我们调用`getLikes`函数时,会默认抛出错误.如果你想处理一个特定的错误,仅仅用`try/catch`把`await`包起来就行.   

这样会极大的提高你的生产力,至少你不用到处写`if (err) return fn(err)`(或者更糟糕,你会忽略错误处理).

今后如何?

- `promise` 现在[移动端和桌面浏览器](http://caniuse.com/#feat=promises)以及`nodejs 0.12+` 都可以使用
![promise in browser](http://s1.jiasucloud.com/blog/image/WX20170803-154609.png-p)
- `async`和`await`: `v8` `Edge`和`Firefox`  已经完全支持


[回调地狱]: https://twitter.com/dr4goonis/status/476617165463105536


