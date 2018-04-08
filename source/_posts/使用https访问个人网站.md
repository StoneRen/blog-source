---
title: 使用https访问个人网站
date: 2017-10-21 23:25:31
tags: [https,dns,github,github page,http,ssl]
---

如果你是在web端浏览器访问本站的话,看地址栏左上角,是不是绿色小锁了,也就说可以用`https`进行本站访问了.

事情起因在于之前在阅读自己博客的时候,突然发现一个小圆球,点击一看,全是一堆low文,竟然被运营商劫持了.叔可忍婶不可忍,要干掉这个万恶的广告.

![](http://ou1djxzjh.bkt.clouddn.com/blog/image/qjj20cm09gmxv.jpg-s)
非常简单的操作,主要是有个免费的机会能让大家使用,不想博客被运营商劫持的看一下吧.
依据文章[为自定义域名的GitHub Pages添加SSL 完整方案](https://segmentfault.com/a/1190000007740693)的指导进行的设置.如果本文不清楚的,可以在原文中进行查看.

下面是具体操作步骤:

<!--more-->

## 注册账号

这个很简单,输入邮箱和密码就ok了.Go to [cloudflare](https://www.cloudflare.com)

## dns配置

### 添加记录
添加`A`和`CNAME`记录,和正常的dns服务一样设置,如下图:

![dns](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-145702@2x.png-s)

### 设置dns
在原有的域名服务商中进行修改,由`cloudflare`进行域名解析.

按照如下设置,修改原有域名解析:
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-144536@2x.png-s)


这个域名,是我7年前在`ename`注册的,所以需要在`ename`中进行dbs解析设置
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-150718.png-s)

设置好后就能在`cloudflare`中看到结果:
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-145715@2x.png-s)

### 规则配置
在`Page Rules`中对url进行规则设置:

![](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-145104@2x.png-s)

在`Crypto`中打开`Always use HTTPS`:
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-151410@2x.png-s)

ok,完成,等待解析吧.

![ok](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-150012.png-s)


## 问题

完全设置好后,发现报错,如下图:
![error](http://ou1djxzjh.bkt.clouddn.com/blog/image/WX20170906-145318.png-s)

这个问题是因为`cloudflare`还没有生效,等几分钟后就可以正常访问.


可惜还有一个问题,每次在微信访问的时候,总是被拦截,真不知道在不备案的情况下如何跳过啊.为啥不备案,因为网站是托管在github上的.
<img src="http://ou1djxzjh.bkt.clouddn.com/blog/image/WechatIMG187.png-s" width="60%" />