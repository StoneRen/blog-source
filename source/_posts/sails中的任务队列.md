---
title: sails中的任务队列
date: 2017-07-31 18:34:35
tags: [sails,job,nodejs,async]
---
## 问题
先看一个最简单的需求.
用户申请直播间,管理员审核通过,审核通过后,创建直播间,并且通知用户.  
在这过程中 `审核操作` `创建直播间`和`通知用户`,其实是三个`controller`干的事情,而且比如`通知用户`其实和`审核操作`的关系不是那么强烈.

所以我的思路是,`审核操作`触发通知,订阅了该消息的任务自己去执行自己的逻辑,这样既减轻了耦合度,又让所有操作单独处理,还全都是异步,不会造成长久等待.


## 原有方式

```js
module.exports = {
  pass(apply, cb) {
    // ③ 开通直播间
    Live.create(live).exec(function(err, record) {
      if (cb) cb(err, record);
      // ④ 开通直播间后触发通知
    })
  },
  update(req, res) {
  
    var id = req.params['id'];
    // ① 管理员审核
    Apply.update({
      id
    }, {
      status
    }).exec((err, updated) => {
      // ② 审核通过
      this.pass(updated[0], function(err, rec) {
        res.json({
          code: 1,
          data: rec,
          msg: 'ok'
        })
      });
    });
  },
}
```
<!-- more -->
##  解决方案

1. 创建 `api/jobs/` 文件夹 
	所有的任务触发都以单独文件的形式存放在这里
   
2. 在启动时触发任务 

```javascript 
const includeAll = require('include-all');
const _ = require('lodash');

var jobs = includeAll({
  dirname: 'api/jobs',
  filter: /(.+)\.js$/,
  optional: true,
  excludeDirs: /^\.(git|svn)$/
});

(function loadJobs() {
  _.each(jobs, function(list, key) {
    sails.on(key, function(data) {
      _.each(list, function(func) {
        func(data);
      })
    })
  })
})();
```

## 使用

1. 创建任务

```javascript
//  api/jobs/apply.update.js
module.exports = [
  // 开通直播间
  function createLive(apply) {
      Live.create(live).exec(function(err, record) {
        console.log(record)
        if (cb) cb(err, record);
      })
    }
  },
  // 通知用户
  function noticeToUser(){
    // TODO
  }
]
```
2. 触发事件
```
// 在自己的业务逻辑中,触发事件
sails.emit('apply.update',updated[0]);
```
