---
title: 深度学习自习题2-模仿instagram滤镜
date: 2017-09-23 23:25:31
tags: [ai,deep learn,synaptic]
---

依然还是用的[synaptic](https://github.com/cazala/synaptic).根据官方的例子稍微修改了一下.文章主要分2部分`演示部分`和`核心代码`.


## 视频演示

点击下面视频的播放按钮,查看效果演示吧

<video controls="controls" src="http://7xi4sn.com1.z0.glb.clouddn.com/blog/video/ai/ai_2_1.mp4"></video>


## 最终效果
以下全是训练200次后的效果,当然图片质量上会有部分压缩.
<!--more-->
### **instagram Clarendon 滤镜效果:**
**原图:**
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/oldpic.jpeg-s) ![](http://ou1djxzjh.bkt.clouddn.com/blog/image/newpic_1.jpeg-s)


**测试图片1:**
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/original_1.jpg-s) ![](http://ou1djxzjh.bkt.clouddn.com/blog/image/1-1.png-s)

**测试图片2:**
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/original_2.jpg-s) ![](http://ou1djxzjh.bkt.clouddn.com/blog/image/2-1.png-s)


### **instagram 泛黄滤镜:**
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/newpic_2.jpeg-s)

训练结果:
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/2-2.png-s)

### **instagram Amaro 滤镜**
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/newpic_3.jpeg-s)
训练结果:
![](http://ou1djxzjh.bkt.clouddn.com/blog/image/1-3.png-s) ![](http://ou1djxzjh.bkt.clouddn.com/blog/image/2-3.png-s)


## 代码部分

本来想把代码放在`jsfiddler`上,但是`jsfiddler`不能上传图片,而`canvas`只能读取本域的图片数据,所以没办法发出全部代码来.

但其实核心代码也比较简单.

核心训练代码如下:

```js
var px;
for (index = 0; index < size.value; index += 2) {
	px = pixel(oldPic, 0, 0);
	px = px.concat(pixel(oldPic, -1, -1));
	px = px.concat(pixel(oldPic, 0, -1));
	px = px.concat(pixel(oldPic, 1, -1));
	px = px.concat(pixel(oldPic, -1, 0));
	px = px.concat(pixel(oldPic, 1, 0));
	px = px.concat(pixel(oldPic, -1, 1));
	px = px.concat(pixel(oldPic, 0, 1));
	px = px.concat(pixel(oldPic, 1, 1));
	perceptron.activate(px);
	perceptron.propagate(.12, pixel(newPic, 0, 0));
}
```


