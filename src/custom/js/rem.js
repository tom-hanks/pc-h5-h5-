!(function (win, doc) {
    function ss() {
        var size = (window.innerWidth / 750) * 100;
        doc.documentElement.style.fontSize = (size < 100 ? size : 100) + 'px';
        console.log('rootFont', size, (size < 100 ? size : 100))
        localStorage.setItem("$rootFont", (size < 100 ? size : 100));
    }
    var evt = 'resize';
    var timer = null;
    win.addEventListener(evt, function () {
        clearTimeout(timer);
        timer = setTimeout(ss, 300);
    }, false);
    win.addEventListener("pageshow", function (e) {
        if (e.persisted) {             //读取缓存
            clearTimeout(timer);
            timer = setTimeout(ss, 300);
        }
    }, false);
    ss();
}(window, document));