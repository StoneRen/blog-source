---
title: hexo与vue关于模板处理的冲突
date: 2017-08-16 20:04:34
tags: [vue,ejs,delimiters,html,hexo]
---

## 问题

今天在写blog过程中,新上了自己的[读书频道](/book/).结果碰到了下面的问题.

先看代码部分:

```html
<div id="book-box">
  <div v-for="(book,index) in books" :key="index">
    <h2 v-if="!books[index - 1] || books[index - 1].date !== book.date">{{ book.date }}</h2>
    <a class="photo-href" href="javascript:;">
      <figure>
        <img :src="qnroot+book.url+'-sm'" :alt="book.title" :data-target="qnroot+book.url+'-p'">
      </figure>
    </a>
    <div class="review">
        <p><strong>{{book.title}}</strong></p>
        <p v-html="book.review"></p>
    </div>
    <div class="clearfix"></div>
    <p>
      购买链接: <a v-for="(h,i) in book.store" target="blank" :href="h.url+'&from=jsfun.info'">{{h.key}}</a>
    </p>
  </div>
</div>
```
很正常的代码,结果其他地方都正常,循环啊,条件判断都很正常.就是简单的`{{`和`}}`类似最简单的地方全都为空,全都无法正常显示.

哎,最终无语了,我都把分隔符分开显示了,竟然`hexo`还是要去给我解析.如果上面那段话你没看明白,去看下面的截图吧.
自己感受吧.我的编辑器能正常解析,但是在`hexo`中还是要去解析中间的字符啊.我对你的坚强佩服的五体投地.

![hexo对字符的坚强解析](	
https://ss.jiasucloud.com/blog/image/WX20170816-201122.png-s)

<!-- more -->
## 原因

一开始以为,自己不小心,那个变量写错了.但看了几次都没发现问题.
后来一琢磨应该是和`hexo`的模板冲突了.因为博客会先解析`ejs`再由页面中的`vue`来进行解析的.

查看一下,果然,`ejs`报错了.

```sh
INFO  Start processing
FATAL Something's wrong. Maybe you can find the solution here: http://hexo.io/docs/troubleshooting.html
Template render error: (unknown path) [Line 65, Column 8]
  unexpected token: }}
```
 
## vue解决办法

整套博客系统采用的是`ejs`,那就不要修改了.既然只有几个页面用了[vue],那就直接修改[vue]吧.

有两种办法,具体看下面.

### v-html

比如原先是这样的,

```html
<h2 v-if="!books[index - 1] || books[index - 1].date !== book.date">{{ book.date }}</h2>
```
变化为

```html
<h2 v-if="!books[index - 1] || books[index - 1].date !== book.date" v-html="book.date"></h2>
```

这样做好处就是改动很少,但是,下面这样的就麻烦了

```html
<div class="review">
    <p><strong v-html="book.title"></strong></p>
    <p v-html="book.review"></p>
</div>
```
其实本来不想这样写,但是如果用`v-html`只能这样写了,感觉很别扭不是嘛.

### 修改vue模板分隔符

如题,修改vue配置,如下:

```js
new Vue({
  delimiters: ['${', '}']
})
// 分隔符变成了 ES6 模板字符串的风格
```
具体查看[官方解释](https://cn.vuejs.org/v2/api/#delimiters)

没啥技术含量,单纯记录一下.

![加班是唯一提高工作效率的手段吗?](https://ss.jiasucloud.com/blog/image/jiaban.jpeg-s)

[vue]: https://cn.vuejs.org