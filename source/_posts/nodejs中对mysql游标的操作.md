---
title: nodejs中对mysql游标的操作
date: 2017-08-18 23:46:02
tags: [mysql,nodejs,mysqljs,cursor,stream,database]
---

[题外]你还记得当年的[游标卡尺](https://baike.baidu.com/item/游标卡尺/2768806?from=jsfun.info)吗?当时我对这玩意的设计者真是极其的佩服
![游标卡尺](http://s1.jiasucloud.com/blog/image/ybkc.jpg-s)

## 需求

在之前设计的数据结构中有一个js对象(js中的数组和对象以string形式保存在数据中).现在需要针对每一条记录进行重新设定,把js对象拆成单独的字段.

比如,数据结构中有一个字段`fans`,保存的数据如下:

```js
{"fans_id":123456,"fans_name":"StoneRen"}
```

现在需要拆成两个字段`fans_id`和`fans_name`.

## 问题

针对这个问题,咋看还是比较简单的.比如这个需求没什么特殊的.步骤也简单,总共分散步:` 1. 取回数据 2. 解析数据 3. 存储数据`

但问题出在咱们去下一个数据的问题上.按照正常逻辑,我取得一个总数,然后从0开始,逐渐`加一`就可以.但是问题就在于,如果中间id有删除的情况,那该如何判断?

在我之前的逻辑中,设置`增长补偿`为50,`重试次数`为3次.示例如下:

<!-- more -->

1. 从`id:1`开始,进行查询,结束后`id+1`
2. 如果 `id:2` 没有查询到这个数据,重试3次
3. 然后在进行id自增,知道重试50个数字.如果没有的话,可以认定`id`已经是最大数字了(当然逻辑就是认为不可能删除连续50个id)

这个从理论上没有问题,而且实际中运用起来也很有效.当然可以根据实际业务,调整`重试次数`和`增长补偿`

但作为处女座的开发者来说,这个方法有点愚笨.我们来吹毛求疵一下.
![吹毛求疵](http://s1.jiasucloud.com/blog/image/9150e4e5gw1fae0b431b7g204x04x0ul.gif-s)

## 游标

想起十年前刚接触编程时候,操作数据库的时候,能够针对游标进行逐条数据进行操作.这个方法虽然效率低,但是确实用起来很爽.

```
// 游标操作
do while not rec.eof
   //do something
   rec.movenext
loop
```

今天大体过了一遍[mysqljs](https://github.com/mysqljs/mysql),没有发现针对游标的操作.难道真的不能逐条操作了吗.

幸好,网上有同样需求的人.有两个办法.原来在此,[How to use node-mysql without loads all the rows into the memory?](https://stackoverflow.com/questions/36015279/how-to-use-node-mysql-without-loads-all-the-rows-into-the-memory)


## 解决办法

### 小步读取
这个和我上面说的思路大体是一致的.只不过他跳过了`增长补偿`.因为他每次去100条数据,跳过了中间可能缺失的id.但整体思路还是一样的.
这样有一个小缺点就是,我每次取100条数据,然后需要对100条数据异步处理完成之后再进行下一步操作.这个给程序增加了复杂度.

### stream

nodejs的奇特之处体现出来了.直接看代码

```js
var stream = require('stream');

connection.query('select * from bigdata')
  .stream()
  .pipe(stream.Transform({
    objectMode: true,
    transform: function(rows,encoding,callback) {
      rows.forEach(row => { /* do something with each row */ })
      callback()
    }
   })
   .on('finish',() => connection.end() )
```

我自己在实际应用中发现一个问题.在第7行,返回的是`row`而不是`rows`.也就是说数据是一条一条返回的,而不是一段一段返回的.

具体可以查看我在[gist](https://gist.github.com/StoneRen/b64ff25b43903616ae095dea1961fc8c)上的代码.

先来20条数据尝尝,图片比较大,慢慢加载.

![demo](http://s1.jiasucloud.com/blog/image/Kapture_2017-08-18.gif-s?e3)

**注意**:上面[gist](https://gist.github.com/StoneRen/b64ff25b43903616ae095dea1961fc8c)实际上是有问题的,自己跑一下试一下,猜一下原因.

<del>有空把完整代码贴出来,稍微给大家解释一下吧.</del> 虽然不知道具体原因,但是问题已经解决,具体看[下文](/archive/nodejs逐条修改mysql数据-下/)吧