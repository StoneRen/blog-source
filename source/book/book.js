var app = new Vue({
  el: "#book-box",
  data: {
    loaded: true,
    qnroot: "https://ss.jiasucloud.com/",
    message: "Hello Vue!",
    books: [
      {
        date: "201708",
        star: 2,
        title: "数字货币时代:区块链技术的应用与未来",
        url: "blog/books/szhbsd.jpg",
        review:
          "全部看完之后,总体感觉这就是一个外行入门的书.作者对于区块链的理解其实不深甚至说浮于表面.作者重点介绍的是比特别而不是区块链.其中有2-3个章节是介绍作者的鹦鹉螺币.后面介绍的也是金融知识.感觉就是作者自己对比特币(其实是自己发行鹦鹉螺币)的初级金融领域的认识. -20170830<br>正在读书中,但是基于上一本从技术角度介绍区块链的书,发现这本书对于原理不是十分透彻,而且感觉是从外行人的角度去说的.因为还没有看完,所以不清楚作者是不是故意这样做的. -20170816",
        store: [
          {
            key: "amazon",
            url:
              "https://www.amazon.cn/gp/product/B071DTZD7N/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1"
          }
        ]
      },
      {
        date: "201707",
        title: "区块链：技术驱动金融",
        star: 4,
        url: "blog/books/qkl_jsqdjr.jpg",
        review:
          "读起来虽然比较多的碰到之前没有接触过的专有名词,但是依然很酣畅淋漓.绝对对技术人员的口味,但是相应的不推荐大众把这个当做入门书.因为你很容易会放弃.想真正入门的,这本书你或早或晚会接触到的.",
        store: [
          {
            key: "amazon",
            url:
              "https://www.amazon.cn/gp/product/B073QHSM7P/ref=oh_aui_d_detailpage_o01_?ie=UTF8&psc=1"
          }
        ]
      },
      {
        date: "201706",
        title: "大秦帝国(第一部 上下卷)",
        star: 4,
        url: "blog/books/dqdg01.jpg",
        review:
          "时隔九年后第三次看`大秦帝国`,依然能被里面的人物和故事所感动.第一次读的时候,就被法家的体面无私所震撼,也被秦孝公的胸怀和气度所折服.名家倍出,有几人能名垂青史,只有天时地利人和.更推荐现在的创业人士读一读,再苦再难想想当时秦孝公接手时候的秦国,一片荒凉,百废待兴.但只要找准人,认清大势,调和关系,依然为后世东出打下了坚实的政治基础和经济基础.",
        store: [
          {
            key: "amazon",
            url: "https://www.amazon.cn/dp/B01M6B0K3E?"
          }
        ]
      },
      {
        date: "201705",
        title: "未来简史",
        star: 4,
        url: "blog/books/wljs.jpg",
        review:
          "不推荐直接读取这本书,如果你没有读过`人类简史`的话.因为作者的奇特而又无可辨别的脑回路,会让你觉着晦涩难懂.但是如果读完`人类简史`并深刻理解作者思路的话,这本书依然可以让你打呼过瘾.",
        store: [
          {
            key: "amazon",
            url:
              "https://www.amazon.cn/%E6%9C%AA%E6%9D%A5%E7%AE%80%E5%8F%B2-%E4%BB%A5%E8%89%B2%E5%88%97-%E5%B0%A4%E7%93%A6%E5%B0%94-%E8%B5%AB%E6%8B%89%E5%88%A9/dp/B01MYH8A99/ref=sr_1_1?s=booksw"
          }
        ]
      },
      {
        date: "201703",
        star: 5,
        title: "人类简史：从动物到上帝",
        url: "blog/books/rljs.jpg",
        review:
          "我认为这本书的价值,可以媲美`马克思主义`,就是他不单单是一本自己思想逻辑的奇特验证,还是站在人类宏观历史上的独立思考.也许你会被作者的观点所吓到,但是作者没有夸大事实(夸大了我也不知道)只是平心静气的拿出事实和简单的逻辑思维就能把你引向作者的观点.我真的认为这是一部能改变整个人类思想进程的一本书.",
        store: [
          {
            key: "amazon",
            url:
              "https://www.amazon.cn/gp/product/B00T95D35G/ref=oh_aui_d_detailpage_o05_?ie=UTF8&psc=1"
          }
        ]
      }
    ].sort(function(i, j) {
      return i.date < j.date;
    })
  }
});