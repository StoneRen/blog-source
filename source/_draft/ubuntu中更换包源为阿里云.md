---
title: ubuntu中本地化配置
date: 2017-08-16 23:46:02
tags: [ubuntu,aliyun,apt,hans,zh_CN,utf-8]
---


## 修改软件包源

### 备份默认源

```sh
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

### 修改list

```sh
sudo vim /etc/apt/sources.list

# 把下面内容添加或者替换原有内容

deb-src http://archive.ubuntu.com/ubuntu xenial main restricted #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb http://mirrors.aliyun.com/ubuntu/ xenial multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates multiverse
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse #Added by software-properties
deb http://archive.canonical.com/ubuntu xenial partner
deb-src http://archive.canonical.com/ubuntu xenial partner
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-security multiverse
```

### 重启生效

```sh
sudo apt update
```

效果如下,已经去阿里云镜像查找了.
![aliyun](http://ou1djxzjh.bkt.clouddn.com/blog/image/ubuntu-aliyun-apt.png-s)

## 安装语言包

查看服务器语言包 `locale -a`

![没有中文](http://ou1djxzjh.bkt.clouddn.com/blog/image/there-is-not-chinese.png-s)

安装中文包 `sudo apt install language-pack-zh-hans`

![安装中文](http://ou1djxzjh.bkt.clouddn.com/blog/image/zh_CN_install.png-s)

查看安装效果 `locale -a`
![有中文语言包了](http://ou1djxzjh.bkt.clouddn.com/blog/image/there-is-zh_cn.png-s)