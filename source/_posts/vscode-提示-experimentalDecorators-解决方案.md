---
title: vscode 提示'experimentalDecorators'解决方案
date: 2018-07-26 10:49:06
tags: [vscode,js,typescript]
---


在写typescript的时候,会提示 `experimentalDecorators`

![](http://ou1djxzjh.bkt.clouddn.com/blog/image/experimentalDecorators.jpg-s)

解决方案也很简单,就是设置一下`experimentalDecorators`就行.两种方式.

## 设置vscode
打开vscode的设置,添加如下配置:

```
"javascript.implicitProjectConfig.experimentalDecorators": true
```
这样设置后,本地所有项目都不会提示了,如果typescript项目多的话,建议用这种方式

## 仅配置本项目
在本项目根目录下添加`jsconfig.json`,输入一下内容:

```
{
  "compilerOptions": {
      "experimentalDecorators": true
  }
}
```

两种方案,看你的需要和习惯
