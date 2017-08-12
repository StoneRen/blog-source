---
title: pm2简单介绍
date: 2017-07-26 17:12:31
tags: [pm2,nodejs,jenkins,forever,热更新]
---

非常简洁的一个使用记录,没有去做深究.先挖个坑.


## 介绍

`pm2`和`forever`一样,都可以作为nodejs的守护程序,当然不仅仅是`nodejs`.但相对比来说`pm2`的配置和图形化以及插件都做的不错.

`pm2 list`:
![pm2](http://ou1djxzjh.bkt.clouddn.com/blog/image/pm2-list.png-s)
<!-- more -->
`pm2`的控制台,这部分花钱才能使用大部分功能.
![pm2](http://ou1djxzjh.bkt.clouddn.com/blog/image/pm2-web-ui.gif-s)

## 安装

```sh
npm install -g pm2
```

## pm2使用

```bash
cd static
pm2 start app.js  --name "static" -e ~/logs/static_err.log -o logs/static_out.log --log-date-format "YYYY-MM-DD HH:mm Z"

cd api
pm2 start app.js  --name "api" --log-date-format "YYYY-MM-DD HH:mm Z" -e logs/api_err.log -o ~/logs/api_out.log
```

## 配置文件的使用
上面那样写,太麻烦,可以使用配置方式 `pm2 start pm2.json`

```json
{
  "apps":[{
    "name":"test_api",
    "cwd":"/root/code/test-api",
    "args":"--port=1550",
    "env":{
      "NODE_ENV":"test"
    },
    "script":"app.js",
    "error_file": "/root/code/logs/test_api_err.log",
    "out_file": "/root/code/logs/test_api_out.log"
  }]
}
```


### 提示

1. 没有相互依赖关系的程序要单独自己一个配置,因为reload的时候,会造成所有程序重新加载.
	比如,上面的`static`和`api`是有关联的,他们应该放在一个配置文件中.`op`是一个独立的业务,那就应该自己建立一个独立的配置文件.实际中,也是每个独立应用都有自己的配置文件
2. pm2 中的配置,只能修改,不能删除,可能使用的extend的方式

比如: 一开始我设置了`DEBUG=remind` 然后删除这个配置,再`reload`,`debug`依然为`remind`,所以只好修改为`debug=-` 这样就不会污染log了
3. 注意一下`环境变量`和`参数`的使用方式


## 只启动某个app

```sh
$ pm2 start   ecosystem.config.js --only api-app
$ pm2 restart ecosystem.config.js --only api-app
$ pm2 reload  ecosystem.config.js --only api-app
$ pm2 delete  ecosystem.config.js --only api-app
```

## 使用[pm2-logrotate]

当正式上线后,日志文件会变得慢慢庞大.通过[pm2-logrotate],可以对日志文件进行归档.

### 安装

```sh
pm2 install pm2-logrotate
```
### 配置
可以进行自定义配置,参数请查看[github](https://github.com/pm2-hive/pm2-logrotate#configure)

```sh
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:max_size 1M
pm2 set pm2-logrotate:workerInterval 1800
```
结果如下:

```sh
[PM2] Module pm2-logrotate restarted
== pm2-logrotate ==
┌────────────────┬─────────────────────┐
│ key            │ value               │
├────────────────┼─────────────────────┤
│ dateFormat     │ YYYY-MM-DD_HH-mm-ss │
│ max_size       │ 1M                  │
│ workerInterval │ 1800                │
└────────────────┴─────────────────────┘
```

## 重启服务

重启服务命令为`pm2 restart XXX`.但是这样会终端nodejs程序,导致服务终端,在程序重新启动之前就无法处理请求了.

幸好,`pm2`提供了信号传递.`pm2 sendSignal SIGUSR2 XXX`,程序对信号进行处理.比如程序先fork一个子进程提供服务,然后在将子进程重启,从而达到了热更新.当然这需要程序进行一下简单的处理. 具体查看[官方文档](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#signals)

[pm2-logrotate]:https://github.com/pm2-hive/pm2-logrotate