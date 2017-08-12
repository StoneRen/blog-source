$(function() {
  photoInit();
});

function photoInit() {
  var box = $("#photo-box");
  var html = render();
  box.html(html);
}

function render() {
  var str = "";
  for (var i = 0, l = data.length; i < l; i++) {
    var item = data[i];
    if (!data[i - 1] || data[i - 1].date !== item.date) {
      str += `<h2>${item.date}</h2>`;
    }
    str += `<a href="javascript:;"><figure><img src="${qnroot + item.url}-sm" alt="${item.title}  @${item.location} ${item.date}" data-target="${qnroot + item.url}-p"></figure></a>`;
  }
  return str;
}
