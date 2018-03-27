(function(doc,win){
    var docEl = doc.documentElement
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
  })(document,window)