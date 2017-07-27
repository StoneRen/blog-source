---
title: 更换yarn源为淘宝镜像
date: 2017-07-25 16:49:05
tags:
- npm
- yarn
- lock
- cnpm
---


相信用`npm`的各位,已经把源切换到淘宝镜像了.今天在使用`yarn`的时候,结果巨慢务必.猜测是用了国外的镜像.

查看一下:

```bash
yarn config get registry
# => https://registry.yarnpkg.com
```

调整为淘宝镜像
<!-- more -->
```bash
yarn config set registry https://registry.npm.taobao.org

# yarn config v0.21.3
# success Set "registry" to "https://registry.npm.taobao.org".
# ✨  Done in 0.07s.
```

其实对于`npm`和`yarn`优劣之争,大家都还是从自己的业务出发吧,我看过现在的一篇文章,推荐个大家阅读[为什么我不使用 shrinkwrap（lock）](https://zhuanlan.zhihu.com/p/22934066)