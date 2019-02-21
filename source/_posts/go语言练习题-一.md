---
title: Go语言练习题 (一)
date: 2017-09-15 23:02:21
tags: [go,newton,map,slice]
---

早就听说`Go语言`,今天按照官方的指南走了一下.正好看到有几个官方的练习题.看看自己的知识到底掌握了没,就顺着做了下官方作业.各位如果是`Go`高手,也请指点一二.

下面全都是按照[官方指南](https://tour.go-zh.org/list)走的,之前也没接触过`Go语言`,今天刚学习就做了下面的练习题,所以作业可能很简陋.或许以后经验丰富了,会再回来优化的.

本篇文章就是按照[官方指南](https://tour.go-zh.org/list)的顺序做了3个作业: `牛顿法求平方根`,`生成自定义图片`和`统计文章内单词重复次数`.

<!--more-->


## 牛顿法求平方根

实验地址: [Go指南-练习：循环和函数](https://tour.go-zh.org/flowcontrol/8)

>牛顿法是通过选择一个初始点 z 然后重复这一过程求 Sqrt(x) 的近似值:

>![newton](http://s1.jiasucloud.com/blog/image/newton.png-s)

我的作业:

```go
package main

import (
	"fmt"
	"math"
)

func Sqrt(x float64) float64 {
	z :=1.0
	for count:=0;count<10;count++ {
		z = z-(z*z-x)/2/z
	}
	return z
}

func main() {
	fmt.Println(Sqrt(2))
	fmt.Println(math.Sqrt(2))
}
```

执行结果如下,和官方的结果对比一下:

```sh
// 执行结果
1.414213562373095
1.4142135623730951
```

## 生成自定义图片

试验地址: [Go指南-练习：slice](https://tour.go-zh.org/moretypes/15)

要求如下:
> 实现 `Pic` 。它返回一个长度为 `dy` 的 `slice`，其中每个元素是一个长度为 `dx` 且元素类型为8位无符号整数的 slice。当你运行这个程序时， 它会将每个整数作为对应像素的灰度值（好吧，其实是蓝度）并显示这个 slice 所对应的图像。


我的作业如下:

```go
package main

import "golang.org/x/tour/pic"

func Pic(dx, dy int) [][]uint8 {
	var blocklist [][]uint8
	
	for i:=0;i<dy;i++ {
		var block []uint8
		for j:=0;j<dx;j++ {
			block = append(block,uint8(i*j))
		}
		blocklist=append(blocklist,block)
	}
	return blocklist
}

func main() {
	pic.Show(Pic)
}
```

我生成的图片如下:
![pic_1](http://s1.jiasucloud.com/blog/image/go_pic_slice.png-s)  ![pic_2](http://s1.jiasucloud.com/blog/image/go_pic_slice_2.png-s)  ![pic_3](http://s1.jiasucloud.com/blog/image/go_pic_slice_3.png-s)

去生成自己的图片吧,[go Go GO](https://tour.go-zh.org/moretypes/15)


## 统计文章内单词重复次数



原文如下:[Go指南-练习：map](https://tour.go-zh.org/moretypes/20)
题目要求:
>实现 WordCount。它应当返回一个含有 s 中每个 “词” 个数的 map。函数 wc.Test 针对这个函数执行一个测试用例，并输出成功还是失败。

我的作业如下:

```go
package main

import (
	"fmt"
	"strings"
	"golang.org/x/tour/wc"
)

func WordCount(s string) map[string]int {
	var strlist []string
	m := make(map[string]int)
	strlist = strings.Fields(s)
	for i := 0; i < len(strlist); i++ {
		key := strlist[i]
		ele, ok := m[key]
		fmt.Printf("%v", ele)
		if ok {
			m[key] += 1
		} else {
			m[key] = 1
		}
	}
	return m
}

func main() {
	wc.Test(WordCount)	
}
```

上面的作业,如果用我的代码自己试验的话,会发现一个别扭的地方.就是代码`第16行`.是不是我忘了去掉这个调试信息.

答案当然不是的.

如果去掉这一行,系统会报错,`tmp/sandbox160622148/main.go:17:16: ele declared and not used`

但其实`双赋值`必须得有2个值啊.

查啊查,终于找到了答案.[Go官网解释-The blank identifier](https://golang.org/doc/effective_go.html#blank).修改办法就是设置如下 `_, ok := m[key]`

修改后,终于清爽了,又一次拯救了处女座.

```sh
PASS
 f("I am learning Go!") = 
  map[string]int{"Go!":1, "I":1, "am":1, "learning":1}
PASS
 f("The quick brown fox jumped over the lazy dog.") = 
  map[string]int{"brown":1, "the":1, "lazy":1, "dog.":1, "The":1, "quick":1, "over":1, "fox":1, "jumped":1}
PASS
 f("I ate a donut. Then I ate another donut.") = 
  map[string]int{"donut.":2, "Then":1, "another":1, "I":2, "ate":2, "a":1}
PASS
 f("A man a plan a canal panama.") = 
  map[string]int{"A":1, "man":1, "a":2, "plan":1, "canal":1, "panama.":1}
```
