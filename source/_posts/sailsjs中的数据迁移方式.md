---
title: sailsjs中的数据迁移方式
date: 2017-07-21 15:57:30
tags: 
- sails
- model
- alter
- mysqldump
---


在`sailsjs`中,有三种数据迁移方式: `safe`,`alter`和`drop`.在开发环境和测试环境中,直接使用`alter`会很方便的进行数据的迁移.

官方对三种方式的说明 [具体可查看此链接](http://sailsjs.com/documentation/concepts/models-and-orm/model-settings#?database-migrations)

|**方式**|**解释**|
|:---|:---|
|`safe`|系统不会主动迁移数据(库),必须手动操作|
|`alter `|自动迁移数据字段,并试图保存现有数据|
|`drop`|每次启动系统时,删除所有数据,并且每次重建model|

在实际工作中碰到两个问题

1. `alter`方式中,当数据库中有比较多的数据的时候(其实也不多,比如6000个用户),在网速情况不好的情况,会出现两个问题.
2. 在正式环境中,无法使用`alter`,导致在正式环境下,必须手动进行数据库的表结构修改.

## `alter`的两个问题

官方说明如下:

> **Auto-migrations** - Auto-migrations should `never be enabled when connecting to a database with data you care about`. Instead, use auto-migrations with fake data, or with cached data that you can easily recreate.
>  But if you are using drop or alter, `Sails will load every record in your development database into memory, then drop and recreate the physical layer representation of the data` (i.e. tables/collections/sets/etc.)

标注的地方,说明一下.    
在`alter`模式下,`sails`在启动的时候,会把每一条放到内存中,然后删除并且重建数据.这就会导致下面两个问题
### 启动时间超时
我的数据在`6000`条,网速在`1m`的情况,启动大约会有4分钟,想想就太恐怖了.当然在我的正式环境中,`10000`条数据,10秒内就可以搞定了.
`sails`的默认超时时间是`60*1000ms`,也就是1分钟.
**解决办法:** 延长超时时间.
配置如下:

```js
// config/orm.js
module.exports.orm = {
  _hookTimeout: 60000 
};

// config/pubsub.js
module.exports.pubsub = {
  _hookTimeout: 60000 
};
```
**提示**: 网上说只需要配置`orm`就可以,但是经过实际验证,需要修改以上两个地方

### 超时后未被验证的数据会被删除

按照上面的说法,`在alter模式下,sails在启动的时候,会把每一条放到内存中,然后删除并且重建数据.`,也就是说,如果数据超时时间到了,还有些数据没有被重建完,那这些数据就会被丢弃,也就造成了数据库的数据丢失.

这就是官方说的 `never``never``never`不要在正式环境中使用`alter`数据迁移方式


## 鱼和熊掌想兼得

出于实际情况(就是没钱找DBA),我既想使用`sails`便捷的数据方式,但是也要保证我的正式环境的数据不会被`丢弃`.😆
暂时想到有两种解决办法.

### 使用非关系型数据库

来自于官方的说明,也比较好理解

> For example, imagine you add a new attribute to one of your model definitions. If that model is configured to use MongoDB, then this is no big deal; you can keep developing as if nothing happened. But if that model is configured to use MySQL, then there is an extra step: a column must be added to the corresponding table (otherwise model methods like .create() will stop working.) So for a model using MySQL, adding an attribute is a breaking change to the database schema. -- http://sailsjs.com/documentation/concepts/models-and-orm/model-settings#?database-migrations

以上大体意思是:添加一个字段时,`mongodb`不会受什么影响,但是`mysql`的话,就必须在表中添加这个字段,否则类似于`create`方法就无法正常使用了
所以非关系型数据库,貌似是一个好的解决方案,但是官方还是给了一盆冷水:

> Even if all of your models use MongoDB, there are still some breaking schema changes to watch out for. For example, if you add unique: true to one of your attributes, a unique index must be created in MongoDB.

意思是说,即使你全部使用`mongoDB`,新增`唯一索引`对`MongoDB`来说也是一个`突破性的模式改变`,`sails`还是需要对其进行上面的重建操作.

所以那些不修改数据库唯一索引的情况下,,`mongoDB`对你来说是一个很好的选择.如果不是这种情况,那么你依然不能在正式环境中使用`alter`方式

### 修改程序部署流程

很临时的方案就是,既然原因出在超时对数据造成丢失.那么就:
1. 增大超时时间
2. 在更新前备份数据库

其实这一个也不算解决方案,只是一种妥协的办法.

如果有专业的数据库人员,可以给提供一个方案.比如我先在测试环境中更新完数据结构,然后在正式环境我只是更新数据结构,不在由`sails`进行数据监测.先记录一下,获取可以通过修改`sails`的钩子,可以实现这个方式.已经更新,请具体看新文章[sails中正式环境的数据库迁移](https://stoneren.github.io/2017/07/24/sails%E4%B8%AD%E6%AD%A3%E5%BC%8F%E7%8E%AF%E5%A2%83%E7%9A%84%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%81%E7%A7%BB/)




[官方指导](http://sailsjs.com/documentation/concepts/models-and-orm/model-settings)