---
title: nginx静态服务器405报错
date: 2018-04-18 15:05:07
tags: [nginx,cors,405,POST,OPTIOS]
---

搭建一个nginx静态文件服务器,结果报跨域问题,先搞定跨域问题

```
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:7077' is therefore not allowed access.
```
nginx解决跨域问题,配置还是比较简单的,解决如下: 
```conf
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Credentials' 'true';
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
```

解决完跨域问题后,出现了`405`错误,如下

```
OPTIONS http://URL 405 (Not Allowed)
Failed to load http://URL: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:7077' is therefore not allowed access. The response had HTTP status code 405.
```

这是因为nginx搭建的静态服务器,只能使用`GET`方法,其他方法都是不被允许的.而我们现在要用`POST`方法来请求,顺带着又出来一个`OPTONS`请求.

`OPTINS`请求又引发了跨域,增加如下配置:

<!--more-->

```
add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
```

关于为啥`post请求会携带optins请求`,可以看这篇文章[99%的人都理解错了HTTP中GET与POST的区别](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4#rd)

我们还要通过把405代理到get方式来处理,以便能拿到我们想要的结果

完整代码如下: 

```
upstream static_resource { 
  server localhost:81; 
}
server {
  listen       81;
  server_name DOMAIN;

  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    root   /Users/ren/work/code/oss/;
  }
}
server {
  listen       80;
  server_name  DOMAIN;
  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    root /Users/ren/work/code/oss/;
  }
  error_page 405 =200 @405; 
  location @405 { 
    root /Users/ren/code/oss/;
    proxy_method GET; 
    proxy_pass http://static_resource;  
  }
```
