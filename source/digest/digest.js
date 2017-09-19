var app = new Vue({
  el: "#box",
  data: {
    dataUrl:"https://raw.githubusercontent.com/StoneRen/digest/master/kindle.txt",
    count:5,
    show: false,
    oData: [],
    dData: []
  },
  methods: {
    random() {
      var length = this.oData.length;
      this.dData=[];
      var data = [];
      for (var i = 0, l = this.count; i < l; i++) {
        var index = Math.ceil(Math.random() * length);
        data.push(this.oData[index]);
        this.oData.splice(index, 1);
      }
      this.read(data);
    },
    gotoUrl(){
      window.open("https://github.com/StoneRen/digest/blob/master/kindle.txt")
    },
    read(data) {
      var self = this;
      if (data.length) {
        var originData = data.shift();
        if (originData) {
          var digestArr = originData.split("\r\n");
          var digest;
          if (digestArr[0] === "") {
            digest = {
              title: digestArr[1],
              date: digestArr[2].split("|")[1],
              content: digestArr[4]
            };
          } else {
            digest = {
              title: digestArr[0],
              date: digestArr[1].split("|")[1],
              content: digestArr[3]
            };
          }
          this.dData.unshift(digest);
          setTimeout(function() {
            self.read(data);
          }, 300);
        }
      }
    },
    getData() {
      $.ajax(this.dataUrl)
        .then(data => {
          this.show = true;
          var data = data.split("==========");
          this.oData = data;
          this.random();
        })
        .catch(function(err) {
          console.err(err);
        });
    }
  },
  created() {
    this.getData();
  }
});
