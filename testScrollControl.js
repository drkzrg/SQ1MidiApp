// offset = decalage

    var latestKnownScrollY = 0,
    ticking = false;

    function onScroll(el){
        latestKnownScrollY = window.scrollY;
        update(el);
    }

    function update(el){
        console.log(el);
        el.style.backgroundColor = 'blue';
    }

    var el = document.querySelector('.trg');

    window.addEventListener('scroll', onScroll, false);




