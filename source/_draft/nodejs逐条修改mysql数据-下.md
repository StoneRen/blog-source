---
title: nodejs逐条修改mysql数据(下)
date: 2017-08-22 23:47:25
tags: [mysql,sql,cursor,stream,pipe]
---

书接[上文](http://jsfun.info/2017/08/18/nodejs%E4%B8%AD%E5%AF%B9mysql%E6%B8%B8%E6%A0%87%E7%9A%84%E6%93%8D%E4%BD%9C/).

上文中介绍了,针对mysql的逐条数据进行分析.如果你自己真正跑过[gist](https://gist.github.com/StoneRen/b64ff25b43903616ae095dea1961fc8c)上的代码.会发现有问题.



先把代码列在这里,便于下面讨论.至于为什么要用`stream`,去看上[一篇文章](http://jsfun.info/2017/08/18/nodejs%E4%B8%AD%E5%AF%B9mysql%E6%B8%B8%E6%A0%87%E7%9A%84%E6%93%8D%E4%BD%9C/)吧.

![多读书](http://ou1djxzjh.bkt.clouddn.com/blog/image/6af89bc8gw1f8sehf3x4jj20k00k0q7c.jpg-sm)
<!-- more -->

```js
var stream = require('stream');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'XX',
  user: 'XX',
  password: 'XX',
  database: 'XX'
});

var errList = [];

connection.connect();


connection.query('select id,fans_id,fans_nickname,buyer_id,fans_type,fans_info from yztrade')
  .stream()
  .pipe(stream.Transform({
    objectMode: true,
    transform: function(row, encoding, callback) {
      /**
      if (!!row.fans_id) {
        callback()
      } else {
        /**/
        try {
          var fans = JSON.parse(row.fans_info);
          console.log(fans.fans_id);
          var query = `UPDATE yztrade SET fans_id=${fans.fans_id},fans_nickname='${fans.fans_nickname}',buyer_id=${fans.buyer_id},fans_type=${fans.fans_type} where id=${row.id}`;
          connection.query(query, function(err) {
            if (err) {
              errList.push(row.id);
            }
            console.log(`完成id: ${row.id}`)
            callback();
          });
        } catch (err) {
          errList.push(row.id);
          callback();
        }

      // }
    }
  }))
  .on('finish', function() {
    connection.end();
    if (errList.length) {
      console.log('未正常处理的id为:')
      console.log(errList)
    }
    console.log('end')
  })
```

## 问题

如果自己跑上面的代码,如果记录多的话,我自己一条一条试验,在30条记录的时候,就无法正常反应了.诡异的是,没有任何报错.用调试工具一步一步走,也没有任何反应.

最终发现问题出在这段代码.

```js
connection.query(query, function(err) {
   if (err) {
    errList.push(row.id);
   }
  console.log(`完成id: ${row.id}`)
  callback();
 });
```
如果把这段代码去掉,成千上万条记录都没有问题.



## 猜测
我粗略猜测,因为用的是`stream`方式传递数据.虽然实际效果我们是一条一条记录的接收,但实际可能不是这样的原理.

因为在测试的时候10条记录可以,为什么40条记录就不行呢.

我猜是因为同时回来了多条数据,接收后直接再去连接数据库,进行`upodate`操作.结果数据库就被无法响应了.

## 解决

按照上面的猜测,那就把上面的操作分成两个步骤:`1. 获取数据 2. 更新数据`.

大体代码如下:

```js
/**
 * 获取所有原始数据
 */
function getIds() {
  var ids = [];
  var errList = [];
  return new Promise(function(resolve, reject) {
    connection
      .query(
        "select id,fans_id,fans_nickname,buyer_id,fans_type,fans_info from yztrade"
      )
      .stream()
      .pipe(
        stream.Transform({
          objectMode: true,
          transform: function(row, encoding, callback) {
            try {
              // 业务处理
              setTimeout(function() {
                callback();
              }, 30);
            } catch (err) {
              console.log(`解析${row.id}出粗,已经记录,继续查询`);
              callback();
            }
          }
        })
      )
      .on("finish", function() {
        console.log("所有更新数据已经获取");
        if (errList.length) {
          console.log("未正常处理的id为:");
          console.log(errList);
        }
        resolve(ids);
      });
  });
}

/**
 * 进行处理
 */
function handler(ids,errList) {
  var trade = ids.shift();
  var errList = errList||[];
  var fans = trade.fans;
  var query = `UPDATE yztrade SET fans_id='${fans.fans_id}',fans_nickname='${fans.fans_nickname}',buyer_id='${fans.buyer_id}',fans_type='${fans.fans_type}' where id=${trade.id}`;
 
  connection.query(query, function(err) {
    if (err) {
      console.log(err)
      errList.push(trade.id);
      console.log(`${decodeURIComponent(fans.fans_nickname)} 分析出错`);
    } else {
      console.log(`${decodeURIComponent(fans.fans_nickname)} 分析完成`);
    }
    
    if (ids.length) {
      setTimeout(function() {
        handler(ids,errList);
      }, 50);
    } else {
      console.log("全部更新完毕");
      connection.end();
      if (errList.length) {
        console.log("没有更新成功的数据,请自己重新检查一下:");
        console.log(errList);
      }
    }
  });
}

getIds()
  .then(function(ids) {
    handler(ids);
  })
  .catch(function() {
    console.log("获取原始数据出错");
  });
 ```


具体可以看[gist](https://gist.github.com/StoneRen/b362b00613c408407ef5e821549015f1)代码.

注意以下两个地方.

`getIds`负责获取和分析数据.作为第一步,先把数据存好,以便后面进行处理.

`handler` 递归调用,对每条数据进行修改.

以上两个步骤中有报错的记录,都会记录下来,这样数据修改过程中的错误,全都记录下来,便于人工去处理.