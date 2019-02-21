---
title: photo频道新上分页功能
date: 2017-09-18 23:43:14
tags: [hexo,photoswipe,vue,pager]
---


在之前上线了[记录](/photo)频道,主要存放一些记录生活的照片.

一开始搭建非常简单,就是一个`photo.js`数据文件,然后用[vue]进行页面渲染.

这段代码简直太简单了,可以查看线上[源码](https://github.com/StoneRen/stoneren.github.io/blob/7c1432789d54eefc618bfa24a0fd9945c9068bbf/photo/photo.js):

```js
var app = new Vue({
  el: "#photo-box",
  data: {
    loaded: true,
    photos: data
  }
});
```

当然中间还有一个用`冒泡排序`对数据进行排序的过程,主要是自己懒的按照时间进行数据排列.所以`懒`才是技术进步的推动力.

![懒](http://s1.jiasucloud.com/blog/image/lan06v05e7v8.gif-s)

但是记录越添加越多,页面加载和展示倒是没有问题.但是页面元素太多,看的确实烦心.或许是处女座的特点吧,一定要再吹毛求疵一下.

![吹毛求疵](http://s1.jiasucloud.com/blog/image/9150e4e5gw1fae0b431b7g204x04x0ul.gif-s)

本文解决三个问题: `vue分页`,`yilia模板viewer修改`和`photoswipe的图片尺寸自适应`

<!-- more -->


## 分页

有了[vue]这个神器,分页功能简直小菜一碟.三下五除二就可以搞定.代码如下:


```js
var app = new Vue({
 data: {
	page:1,
	limit:10
 }.
 methods: {
    render() {
      var index = (this.page - 1) * this.limit;
      var photos = (this.photos = data.slice(index, index + this.limit));
    },
    prev() {
      this.page = this.page - 1;
      if (this.page < 1) {
        this.page = 1;
      }
      this.render();
    },
    next() {
      this.page = this.page + 1;
      if (this.page > this.pageMax) {
        this.page = this.pageMax;
      }
      this.render();
    }
  },
  created() {
    this.pageMax = Math.ceil(data.length / this.limit);
    this.render();
  }
})
```
上面就是最简单的一个分页展示的功能.

## 问题

因为在[yilia]模板中,作者自带了[photoswipe]库,可以看[yilia]中的[源码](https://github.com/litten/hexo-theme-yilia/blob/master/source-src/js/viewer.js).所以我点击图片的时候用了[photoswipe]来进行展示.

这个带来的问题是什么呢.我每次翻页后,页面中的数据`photos`每次都变化了,但是[photoswipe]的变化是有问题.因为[yilia]作者可能认为他翻页是整个页面改变,不是在页内变化.所以作者的[photoswipe]的`items`是通过查找dom元素来填充的.

具体看一下作者的[源码](https://github.com/litten/hexo-theme-yilia/blob/master/source-src/js/viewer.js):

```js
let $imgArr = document.querySelectorAll(('.article-entry img:not(.reward-img)'))

$imgArr.forEach(($em, i) => {
	$em.onclick = () => {
		// slider展开状态
		// todo: 这样不好，后面改成状态
		if (document.querySelector('.left-col.show')) return
		let items = []
		$imgArr.forEach(($em2, i2) => {
			let img = $em2.getAttribute('data-idx', i2)
			let src = $em2.getAttribute('data-target') || $em2.getAttribute('src')
			let title = $em2.getAttribute('alt')
			items.push({
				src: src,
				w: $em2.width,
				h: $em2.height,
				title: title
			})
		})
		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
			index: parseInt(i)
		});
		gallery.init()
	}
})
```
这样做有2个问题:
1. 如果如果下一页的数据比上一页的数据少的话,通过作者的代码源码看,只是会改变`items`中已经存在的值.也就是如果第一页10张图片,`items`长度为10,第二页只有一张图片的话,`items`的长度还是为10,只不过,改变了`items[0]`的值.这是不对的
2. 因为我每张图片都不固定大小,就不能在初始化的时候制定尺寸.导致直接点击展示,看到的景象简直惨不忍睹,如果需要实时自适应图片大小的话,还得修改photoswiper代码.

那就动手改造吧.

## 解决1: yilia模板的改造

### 去掉默认调用`photoswipe`

因为我在页面中的图片不需要点击查看大图,所以我坚决的去掉了普通页面的`viewer`加载.
在`themes/yilia/source-src/js/main.js`去掉初始化调用.

```js
addLoadEvent(function() {
	Share.init()
	//Viewer.init()
	Aside.init()
})
```
这样所有页面就不会调用`viewer`了.

### 在[photo](/photo)页面调用[photoswipe]

在`source/photo/index.ejs`中按照[官方指导](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/getting-started.md),进行[photoswipe]设置

`photo.js`改造如下:

```js
var app = new Vue({
methods: {
    view(index) {
      gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items, {
        index: index
      });
      gallery.init();
    },
    render() {
      var index = (this.page - 1) * this.limit;
      var photos = (this.photos = data.slice(index, index + this.limit));
      var items = [];
      for (var i = 0, l = photos.length; i < l; i++) {
        var photo = photos[i];
        if (photo.type !== "video") {
          photo.index = items.length;
          items.push({
            title: photo.title + " " + photo.date + " @" + photo.location,
            src: this.qnroot + photo.url + "-p",
            w: -1,
            h: -1
          });
        }
      }
      this.items = items;
    },
    prev() {
      this.page = this.page - 1;
      if (this.page < 1) {
        this.page = 1;
      }
      this.render();
    },
    next() {
      this.page = this.page + 1;
      if (this.page > this.pageMax) {
        this.page = this.pageMax;
      }
      this.render();
    }
  },
  created() {
    this.pageMax = Math.ceil(data.length / this.limit);
    pswpElement = document.querySelectorAll(".pswp")[0];
    this.render();
  }
 });
```
为了解决上面的问题1,就是`第12行`代码到`第25行`代码做的事情.也就是说作者原来填充数据是用dom元素填充的,翻页之后其实只会改变原有所有内容.
我先把数据清空,然后拿到什么数据就塞什么数据到`items`,不多不少.第一个问题解决

## 解决2: [photoswipe]的图片自适应

有了上面的改造,数据传递是没有问题了.但所有图片都不是固定大小的.所以页面展示图片的时候非常难看.

按照官方指导修改如下,添加`imageLoadComplete`事件监听:

```js
view(index) {
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items, {
    index: index
  });
  gallery.init();
  gallery.listen("imageLoadComplete", resizeImg);
}
```

重点`resize`代码如下:

```js
function resizeImg(index, item) {
    var img = new Image();
    img.onload = function() {
      item.w = this.width;
      item.h = this.height;
      try {
        item.loaded2 = true;
        gallery.invalidateCurrItems();
        gallery.updateSize(true);
      } catch (error) {
        //console.log(error);
      }
    };
    img.src = item.src;
}
```

ok,现在终于图片能自适应了,不论你什么尺寸,我都能完美展示了.
可以吐一口气了吗?

结果点击放大缩小的时候又出现问题了.

因为图片比较大,点击之后,图片会进行放大.这个是正常操作,不正常的是,在这个页面中`放大之后不到1秒就又恢复原来尺寸`.这个问题看起来比较恶心,一定也要解决这个问题.

而去掉`imageLoadComplete`之后,放大没有问题,尺寸只适应又出问题了.极力推荐[我用小米手机拍摄的这张图](http://s1.jiasucloud.com/blog/photo/PANO_20170312_132021.jpg-p),没用任何滤镜处理,大自然真是太美了.这还是已经压缩了80%,但是效果还是这么迷人,点击放大后,细节虽然有损失,但绝对很惊艳.

那就改造一下吧,也很简单:

```js
function resizeImg(index, item) {
  if (!item.loaded2) {
    var img = new Image();
    img.onload = function() {
      item.w = this.width;
      item.h = this.height;
      try {
        item.loaded2 = true;
        gallery.invalidateCurrItems();
        gallery.updateSize(true);
      } catch (error) {
        //console.log(error);
      }
    };
    img.src = item.src;
  }
}
```
## 注意

当然,修改`theme/yilia/`中任何文件的时候,你需要重新编译一下模板.执行以下命令

```sh
# 跳到模板根目录
cd theme/yilia
webpack --progress --colors
```
其实作者还有一个问题,就是在重新编译的时候,没有进行`clean`所以没如果你有洁癖的话,在编译之前,先把`theme/yilia/source`下的文件清空以下.

还有不懂的,看一下线上[源码](https://github.com/StoneRen/stoneren.github.io/blob/master/photo/photo.js)吧


[vue]:https://cn.vuejs.org/
[yilia]: https://github.com/litten/hexo-theme-yilia
[photoswipe]: https://github.com/dimsemenov/PhotoSwipe