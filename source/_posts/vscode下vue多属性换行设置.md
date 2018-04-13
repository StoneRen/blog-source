---
title: vscode下vue多属性换行设置
date: 2018-04-08 11:13:38
tags: [vscode,vue]
---
在`vue`的官方文档中,有这么个[最佳实践](https://vuejs.org/v2/style-guide/#Multi-attribute-elements-strongly-recommended):

> Elements with multiple attributes should span multiple lines, with one attribute per line.

示例如下:
> Bad
```html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
<MyComponent foo="a" bar="b" baz="c"/>
```
> Good
```html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

但是在`vscode`中,进行格式化,却得不到官方指导的效果,经过多方查找,终于找到解决方案.

<!-- more -->

[github issue#561](https://github.com/vuejs/vetur/issues/561)

具体配置如下:

```json
"vetur.format.defaultFormatter.html": "js-beautify-html",
"vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned"
    }
},
```

ok,大功告成