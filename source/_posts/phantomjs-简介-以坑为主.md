---
title: phantomjs 简介 - 以坑为主
date: 2017-09-30 17:08:17
tags: [phantomjs,坑,debug,remote-debug]
---

[phantomjs],`Full web stack,No browser required`.

[phantomjs]基于`webkit`内核,来编译解释执行javascript代码.比如执行批量脚本的时候,不需要浏览器,只需要借助[phantomjs]就可以执行网页中的js代码了.本文基于官网现在的`2.1`版本.

因为官网的文档算是烂到家了,所以本文中的很多问题,估计你都会碰到,并且可能会像我一样抓狂.![抓狂](http://s1.jiasucloud.com/blog/image/9150e4e5ly1fg4oyrvkjbg201e01e3yw.gif-s)

最开始文章标题是`phantomjs简介`,但是在是被肯坏了.下面调试那个坑,你肯定会碰到.

当然,抓狂过后,解决完问题后的那种心情也是只有自己能体会.

![](http://s1.jiasucloud.com/blog/image/1fd6e8617007011a041b009067051636.gif-s)

本文包含以下内容: `安装` `示例` `回调`和重点介绍的`调试`部分.

<!--more-->
## 安装

安装比较简单,下载编译后的文件和自己从源码编译.重点介绍一下下载安装,因为这是我的执行过程,想编译安装的,请访问[官网](http://phantomjs.org/build.html)

### 下载
到[官网](http://phantomjs.org/download.html)按照你的系统选择合适的文件进行下载.
[phantomjs on MacOS](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-macosx.zip),大约`16.84MB`
> 已经静态编译完成,不需要额外安装`QT`或任何其他库.

以下是其他平台的文件下载地址:
[phantomjs on Linux 64-bit](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2)
[phantomjs on Linux 64-bit](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2)
[phantomjs on windows](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-windows.zip)


### 配置
下载后解压,比如我的存放目录为`~/soft/phantomjs`.
因为我在mac平台,并且平时主要使用`item2`和`terminal`,所以修改`.bash_profile`或者`.zshrc`

```sh
alias phantomjs='/Users/Ren/soft/phantomjs/bin/phantomjs'
```
当然你也可以按照官方指示,把`bin`目录,放在系统的`PATH`中.

测试`phantomjs -v`,结果如下:

```sh
➜  ~ phantomjs -v
2.1.1
```
ok,安装成功.

## 示例

按照下面的代码,我们生成一张百度首页的截图.

```js
// baidu.js
var page = require('webpage').create();
page.open('http://baidu.com', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('baidu.png');
  }
  phantom.exit();
});
```

执行命令 `phantomjs baidu.js`,然后在当前目录下,就可以看到`baidu.png`图片了.
自己试试吧,虽然官网的文档很垃圾,但是大多数文档你可以靠猜.


## 回调

回调会经常用到,所以在此特意说明一下.

如下代码:

```js
var webPage = require('webpage');
var page = webPage.create();
var url = 'http://www.baidu.com';
page.onCallback = function(data) {
  console.log('CALLBACK: ' + JSON.stringify(data));
};
page.open(url, function(status) {
  page.evaluate(function() {
    console.log(23)
    if (typeof window.callPhantom === 'function') {
      window.callPhantom({
        hello: 'world'
      });
    }
  })
})
```

看代码`第9行-第14行`,执行一下,结果是`CALLBACK: {"hello":"world"}`,高兴的是回调成功了,但是`第9行`的命令为啥没有显示出来呢?

因为`page.evaluate`函数是在页面内执行,所以会在页面的控制台打印出`23`.如果我们想调试怎么办呢,也简单,重写`console`函数就可以了.

官方例子如下 [onConsoleMessage](http://phantomjs.org/api/webpage/handler/on-console-message.html):

```js
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};
```
结果如下:
<img src="http://s1.jiasucloud.com/blog/image/phantomjs_console_message.png-s" />


## 调试


### 官网的一堆无用的指导
官网的文档之烂,确实让我刮目相看.比如`page.close`这个文档,简直是绝无仅有,自己[去欣赏一下吧](http://phantomjs.org/api/webpage/method/close.html)

<img src="http://s1.jiasucloud.com/blog/image/phantomjs_page_close.png-s" width="60%" >

[phantomjs]最痛苦的地方,就是出错了,你不知道哪里出错了.他不给你提示.

如下代码:

```js
// exception.js
var foo = 'bar';
console.log(`foo ${bar}`);
phantom.exit();
```
你执行以下上面的代码,会发现半天没反应,直到你思考完人生后,才恍然大悟,这个代码出错了.

<img src="http://s1.jiasucloud.com/blog/image/6af89bc8gw1f8nk1z403aj20cr0b4jrh.jpg-s" />

官网倒是有处理错误的解决办法,如下代码:

```js

var webPage = require('webpage');
var page = webPage.create();

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};
```
这个代码能监听到页面的错误信息,但现在我们的错误不是页面中的错误,而是代码文件本身有问题.那用如下代码,[官网onError](http://phantomjs.org/api/phantom/handler/on-error.html)

> This callback is invoked when there is a JavaScript execution error not caught by a page.onError handler. This is the closest it gets to having a global error handler in PhantomJS, and so it is a best practice to set this onError handler up in order to catch any unexpected problems. The arguments passed to the callback are the error message and the stack trace [as an Array].

所以简单的看一下下面的最简单的代码:

```js
// exception.js
phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};

var foo = 'bar';
// exception 1
console.log('foo' + foot);
// exception 2
console.log(`foo ${bar}`);

phantom.exit();
```
这段代码也没有任何报错,让你能郁闷死.

### 远程调试

上面的官方指导,按说应该可以使用,但是我就是没有报错信息,这个太郁闷了.正好他还有远程调试,我们来试试吧.

`phantomjs --remote-debugger-port=9000  --debug=yes exception.js`

用浏览器打开 `http://127.0.0.1:9000`,看到错误信息,终于露出了微笑的面容了.
![](http://s1.jiasucloud.com/blog/image/smile2.jpg-s)
<img src="http://s1.jiasucloud.com/blog/image/phantomjs_debug_exception.png-s" width="80%" >

但是调整代码正常后,你又会发现一个很诡异的问题.程序不执行,没问题,人家说了,你在控制台输入`__run()`进行代码执行.

转了一大圈,幸运的人啊,你发现还是执行不了(老版本的chrome浏览器没问题的,我的是chrome v61).天啊,人生啊.

![](http://s1.jiasucloud.com/blog/image/6af89bc8gw1f8pomipgp4j20hs0fg76u.jpg-s)

你会发现你输入了 `__run()`,在按回车进行执行的时候,你发现回车之后竟然是`换到下一行`.😤,到底如何执行这个命令啊.不执行命令如何调试啊.

好在有万能的google,否则真的崩溃了.看[高人的解释吧](https://stackoverflow.com/questions/17573249/getting-remote-debugging-set-up-with-phantomjs)

有2种方案解决这个`回车`问题,
1. 在开始调试的时候自动运行 ` --remote-debugger-autorun=yes`
2. 在控制台执行代码

```js
// UPDATE for Chrome: (from Thiago Fernandes below): Apparently the issue is caused by the Chrome not accepting the enter key, so the workaround is to evaluate this function inside chrome console, to get the enterKey working:
function isEnterKey(event) {
  return (event.keyCode !== 229 && event.keyIdentifier === "Enter") || event.keyCode === 13;
}
```
当看到这个结果的时候,真的快要哭了
<img src="http://s1.jiasucloud.com/blog/image/phantomjs_cry.png-s">


[phantomjs]: http://phantomjs.org/