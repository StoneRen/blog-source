---
title: '[翻译] Async and Await (上)'
date: 2017-08-10 23:31:55
tags: [nodejs,javascript,async,await,'callback hell',翻译,promise]
---

> 原文地址:[async and await](https://zeit.co/blog/async-and-await)

`javascript`,尤其是`node.js`经常与[回调地狱]相关联.你如果写过处理很多异步IO的代码,下面的形式你一定会非常熟悉:

```js
export default function getLikes () {
  getUsers((err, users) => {
    if (err) return fn(err);
    filterUsersWithFriends((err, usersWithFriends) => {
      if (err) return fn(err);
      getUsersLikes(usersWithFriends, (err, likes) => {
        if (err) return fn (err);
        fn(null, likes);
      });
    });
  });
}
```
事实证明,这段代码可以被更容易和更安全的书写.   
我会向你展示`Promise`和`async` `await`如何绑定,这也是我们在生产给环境中使用这些新功能所学到的经验教训.   
让我们从上面的陷阱开始前进吧.

> 无法翻墙的,可以直接看下面的twitter图片
> (其实看图片 不光是回调判断出现问题,而且明显层进式判断太多了,业务全都揉在一块了-StoneRen注):
![回调地狱](http://s1.jiasucloud.com/blog/image/Bp1IyS7CYAATIEB.jpg-p)

<!-- more -->

## 回调问题

### 错误处理重复

大多数情况下,你仅仅是想传递错误.   


但是在上面的例子中,你重复了很多次. 当错误实际发生时,很容易丢失`return`,并且仅仅是观察到(没有明显的调试)

> StoneRen注:
> 作者指的是这个地方,重复很多次,自己本身不处理错误,仅仅是传递给专门的业务去挫力
>  if (err) return fn (err);

## 错误处理未指定

当错误发生时很多流行库都会执行一个带着错误参数的回调,而在成功的时候回调用`null`来代替   
不幸的是,情况并非总是如此.你可能会受到`false`而非`null`.还有一些库甚至会完全省略.如果同时发生几个错误,你会收到多个回调.天啊...

## 计划未指定

`callback`总是会及时返回吗?或者在不同的[microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)?或者在不同的`tick`?有时还会一直回调?   
没人知道答案!读你自己的代码一定不会告诉你(`StoneRen注:我感觉这个地方是作者写错了,自己的代码肯定会知道回调情况的.原文:Reading your own code certainly won't tell you`).如果足够幸运,读源码库的文档会告诉你.   
也有可能`callback`会意料之外的多次调用.再次,这几乎肯定会导致代码非常难以进行调试   
在特定情况下,代码会继续运行,但是却不能很好的动作.其他时候,你也会收到一个不是十分明显的堆栈跟踪.  
这些问题的解决方案就是`Promise`的标准. 


## Promise如何工作

`Promise`给你提供了一个明细的规定和API.尽管我们可能会不同意`Promise`的规定和API是最好的方式,但是他们却是被严格定义好的了.

所以当你用`Promise`写代码时,上面提到的规范缺失并不需要我们关心.

This is what the equivalent to setTimeout would look like using Promise:

```js
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

sleep(100)
.then(() => console.log('100ms elapsed'))
.catch(() => console.error('error!'));
```

`Promise`有两个设定的状态:`resolved`和`rejected`.如上所见,你可以配置一对回调包含`resolved`值和`rejected`的值

我们传递回调给`promise`的事实表明,我们经常处理一些针对成功或者失败的回调( `原文:The fact that we pass callbacks to a promise shows that we often deal with somewhat of a false dichotomy.`).很明显,`Promise`需要回调去做意义明确的事情.`promise`和`callback`模式的比较在JavaScript社区已经达成明显共识.

`Promise`返回了一个单一值.不像上面的`callback`模式,你不会获取执行成功之后的错误.或者稍后收到一个值和一个错误.

你可以把`promise`的`resolve`比作`return`,`reject`比作`throw`.正如稍后所见,这种语义上的同等性可以通过关键字`async`和`await`关键字来实现.

就规划目标而言,`Promise`规范已经保证总是在`未来时间`进行调用(比如,下一次`microtask`).这就是说,无论是否已经执行完成,你每次调用`then`或者`catch`时,`promise`都会异步执行.

我们重写开头的例子,类似于如下形式:   

```js
export default function getLikes () {
  return getUsers()
  .then(users => filterUsersWithFriends)
  .then(usersWithFriends => getUsersLikes);
}
```
这样看起来舒服多了.但如果我们的逻辑变了,重构代码会变得非常快速复杂.  
还是上面的代码,一个典型的错误`filterUsersWithFriends`需要做不同的处理.

```js
export default function getLikes () {
  return new Promise((resolve, reject) => {
    getUsers().then(users => {
      filterUsersWithFriends(users)
      .then(resolve)
      .catch((err) => {
        resolve(trySomethingElse(users));
      });
    }, reject)
  });
}
```
没有任何`捷径`能拯救我们,下面我们看一下解决方案.

---未完待续---


[回调地狱]: https://twitter.com/dr4goonis/status/476617165463105536


