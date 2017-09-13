# sails中的定时任务


在系统应用中,经常会碰到定时任务.在[sails的github上](https://github.com/balderdashy/sails/search?q=schedule&type=Issues&utf8=%E2%9C%93)也经常有人碰到这个需求,但是官方一直没有退出自己的定时任务处理.可能和他们自己的业务相关吧.那么在[sails]中如何处理定时任务呢?

在`google`中查找与`sails`相关的定时任务,排在前2位的是以下2个库:   

[sails-hook-cron](https://www.npmjs.com/package/sails-hook-cron)   
[sails-hook-schedule](https://www.npmjs.com/package/sails-hook-schedule)

没有对比后,选择了`sails-hook-cron`,因为之前的一个项目就是用的这个.那现在就以这个为例,讲解一下`sails`中如何执行定时任务.

## 安装
很简单的安装方式:

```sh
npm install sails-hook-cron --save
```

## 配置

在`/config`下创建`corn.js`,配置如下:

```js
module.exports.cron = {
  myJob: {
    schedule: '* * * * * *',
    onTick: function() {
      console.log('I am triggering when time is come');
    },
    onComplete: function() {
      console.log('I am triggering when job is complete');
    },
    start: true, // Start task immediately 
    timezone: 'Ukraine/Kiev', // Custom timezone 
    context: undefined // Custom context for onTick callback 
  }
};
```

官方并没有说明`cron`的说法,具体顺着源码查找 `sails-hook-cron`<=`[node-cron](https://github.com/kelektiv/node-cron)`<=`[corn.js](https://github.com/padolsey/cron.js/blob/master/cron.js)`

```js
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week
│    │    │    │    └───── month
│    │    │    └────────── day of month
│    │    └─────────────── hour
│    └──────────────────── minute
└───────────────────────── second

Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11
//  https://github.com/padolsey/cron.js/blob/master/cron.js
//  For instance, some cron's use a 0-7 range for the day of week where both 0 and 7 represent Sunday. We do not. 
//  sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6
Day of Week: 0-6
```

自己试验一下吧

[sails]: http://sailsjs.com/