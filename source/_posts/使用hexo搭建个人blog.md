---
title: 使用hexo搭建个人blog
date: 2017-06-19 14:21:30
tags: 
- hexo
- npm
- nvm
---


## 安装和配置`hexo`

1. `npm install hexo-cli -g`
2. `hexo init stoneren.github.io`
3.  安装依赖

```sh
cd stoneren.github.io
npm install
hexo s[ever]
```


## 选择和配置模板
自带的模板有点难看,看一个国人写的模板,确实比较舒服 `yilia`,
1. 安装模板   
```sh
git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia --depth=1
```
2. 进行配置,具体可以参见[官方指导](https://github.com/litten/hexo-theme-yilia#四配置)
3. 安装`yilia`模板所需的依赖

```sh
npm i hexo-generator-json-content --save
```
4. 修改根目录的配置

```yaml
jsonContent:
meta: false
pages: false
posts:
  title: true
  date: true
  path: true
  text: false
  raw: false
  content: false
  slug: false
  updated: false
  comments: false
  link: false
  permalink: false
  excerpt: false
  categories: false
  tags: true
```

## 配置github
具体怎么在github中创建blog,不在赘述.

1. 安装依赖 `npm install hexo-deployer-git --save`
2. 修改[配置](https://hexo.io/docs/deployment.html):

	```yaml
deploy:
  type: git
  repo: <repository url>
  branch: [branch]
  message: [message]
	```  


## 部署

具体查看[官方指导](https://hexo.io/docs/commands.html)

- **hexo s[erver]** 本地预览
- **hexo g[erate]** 生成静态文件
- **hexo d[eploy]** 发布到指定的服务器
- **hexo generate --deploy** 生成静态文件然后部署到服务器

## 问题

1. 如果碰到`Error: Module version mismatch. Expected 48, got 51`这样的问题    
 原因:找不到之前的npm依赖,原因是我一开始用的`iterm2`自带的nodejs安装的`hexo`,后来切换到之前我一直使用的`nvm`,导致在我的`nvm`环境中,找不到相关模块.   
 解决办法: 重新安装`hexo`.中间还碰到一个问题,见问题2
2. 在卸载`hexo`的时候,`npm uninstall hexo-cli -g `和`npm uninstall -g hexo`后,竟然还能执行命令`hexo`.   
 原因:  之前安装过`hexo`,因为查看位置在`/usr/local/bin/hexo` 这个肯定就不是自己用node安装的
 解决办法: `rm /usr/local/bin/hexo`
 

