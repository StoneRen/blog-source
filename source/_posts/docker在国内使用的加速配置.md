---
title: docker在国内使用的加速配置
date: 2017-08-02 23:14:15
tags: [docker,mac,镜像,加速,aliyun]
---
在国内使用docker,如果你不是自建私有仓库,慢的让你想拿起键盘来砸电脑屏幕.

我就记录一下国内的加速方案吧.因为我手头是mac,全部以mac环境为准.国内镜像话,去阿里云或者其他容器镜像服务里面找一家.

其实ubuntu下的网上教程很多,就是`mac`的麻烦点.

## 下载

进入阿里云[下载加速地址](http://mirrors.aliyun.com/docker-toolbox/mac/docker-for-mac/?spm=a2c1q.8351553.0.0.102c439cKYeWUN).然后进行安装

## 问题

在`win`和`ubuntu`下都有相应的配置,具体可查看[官方指导](https://docs.docker.com/registry/recipes/mirror/#configure-the-cache).但在`mac`下,上面介绍的方法`--registry-mirrors`和修改`/etc/docker/daemon.json`在我这里都没有起作用.

```sh
➜ docker --registry-mirror=https://registry.docker-cn.com -d

# 执行结果
unknown flag: --registry-mirror
See 'docker --help'.
```
<!-- more -->
修改`/etc/docker/daemon.json`也没有起作用

## mac下配置

现在这个方法,对我来说是可行的,记录一下.


1. 选择docker的配置    
![docker配置](http://s1.jiasucloud.com/blog/assets/WX20170802-101006.png-s)

2. 添加 选定的镜像源   
![docker 添加镜像地址](http://s1.jiasucloud.com/blog/assets/WX20170802-101059.png-s)

3. 重启`docker`

## 国内镜像地址
- [docker官网中国区镜像](https://www.docker-cn.com) 
`--registry-mirror=https://registry.docker-cn.com` 
- [网易163 docker镜像](https://c.163.com/product/service) **未使用,请自行判断** 
`--registry-mirror=http://hub-mirror.c.163.com`
- [USTC镜像加速](https://lug.ustc.edu.cn/wiki/mirrors/help/docker) 
`--registry-mirror=https://docker.mirrors.ustc.edu.cn`
- [daocloud镜像](https://www.daocloud.io/) **需注册** 
`--registry-mirror=http://{your_id}.m.daocloud.io` 
- [alicloud]() **注册后有自己的加速地址** 
`--registry-mirror=https://{your_id}.mirror.aliyuncs.com\`

## 参考资料

[阿里云官方指导](https://cr.console.aliyun.com/#/accelerator)
[国内 docker 仓库镜像对比](http://www.ieevee.com/tech/2016/09/28/docker-mirror.html)