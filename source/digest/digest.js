var app = new Vue({
  el: "#box",
  data: {
    dataUrl: //"test.txt",
      "https://raw.githubusercontent.com/StoneRen/digest/master/kindle.txt",
    count: 5,
    show: false,
    oData: [],
    dData: []
  },
  methods: {
    random() {
      var data = [];
      this.dData = [];
      var length = this.oData.length;
      if (length < this.count) {
        data = this.oData;
        this.oData = [];
      } else {
        for (var i = 0, l = this.count; i < l; i++) {
          var length = this.oData.length;
          var index = Math.ceil(Math.random() * (length - 1));
          if (this.oData[index]) {
            data.push(this.oData[index]);
            // TODO:
            if (this.oData.length) {
              this.oData.splice(index, 1);
            }
          }
        }
      }

      this.read(data);
    },
    gotoUrl() {
      window.open("https://github.com/StoneRen/digest/blob/master/kindle.txt");
    },
    read(data) {
      var self = this;
      if (data.length) {
        var originData = data.shift();
        if (!!originData) {
          var digestArr = originData.split("\r\n");
          var digest;

          if (digestArr[0] === "") {
            var title = digestArr.splice(1, 1);
            var date = digestArr.splice(1, 1);
            var blank = digestArr.splice(1, 1);
            digestArr.splice(0, 1);
            var content = digestArr.join("<br>");
            digest = {
              title: title[0],
              date: date[0].split("|")[1],
              content: content
            };
          } else {
            var title = digestArr.splice(0, 1);
            var date = digestArr.splice(0, 1);
            var blank = digestArr.splice(0, 1);
            var content = digestArr.join("<br>");
            digest = {
              title: title[0],
              date: date[0].split("|")[1],
              content: content
            };
          }
          this.dData.unshift(digest);
          setTimeout(function() {
            self.read(data);
          }, 300);
        }
      } else {
        if (data.length) {
          self.read(data);
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
