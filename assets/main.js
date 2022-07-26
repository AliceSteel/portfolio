const nav = document.querySelector('nav');
const line = document.createElement('div').addClass('line');

line.appendTo(nav);

let active = nav.find('.active');
let pos = 0;
let wid = 0;

if(active.length) {
  pos = active.setAttribute.left;
  wid = active.width();
  line.applyStyle({
    left: pos,
    width: wid
  });
}

document.getElementsByTagName('a').click(function(e) {
  e.preventDefault();
  if(!e.target.parent().hasClass('active') && !nav.classList.contains('animate')) {
    
    nav.classList.add('animate');

    document.getElementsByTagName('li').classList.remove('active');

    let position = _this.parent().position();
    let width = _this.parent().width();

    if(position.left >= pos) {
      line.animate({
        width: ((position.left - pos) + width)
      }, 300, function() {
        line.animate({
          width: width,
          left: position.left
        }, 150, function() {
          nav.removeClass('animate');
        });
        _this.parent().addClass('active');
      });
    } else {
      line.animate({
        left: position.left,
        width: ((pos - position.left) + wid)
      }, 300, function() {
        line.animate({
          width: width
        }, 150, function() {
          nav.removeClass('animate');
        });
        _this.parent().addClass('active');
      });
    }

    pos = position.left;
    wid = width;
  }
});