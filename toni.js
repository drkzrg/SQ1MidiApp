'use strict';

var Toni = function (parent, options) {

    // SVG Object class .parent
    this.svgo = new SVGObject('svg', {
        'width': 95,
        'height': 50,
        'class': 'parent'
    }, parent );

    // Group object class .knobi
    this.group = new SVGObject('g', {
        'class': 'toni',
        'stroke': '#AAA'
    }, '.parent');

    //  Outer rect
    this.outer = new SVGObject('rect', {
        'x': 2,
        'y': 2,
        'rx': 6,
        'ry': 6,
        'width': 90,
        'height': 45,
        'stroke-width': 4,
        'stroke-opacity': 0.8,
        'fill': 'transparent'
    })

    // Inner rect*
    this.inner = new SVGObject('rect', {
        'x': 5,
        'y': 7.5,
        'rx': 3.5,
        'ry': 3.5,
        'width': 83,
        'height': 40,
        'stroke-width': 1 ,
        'stroke-opacity': 1,
        'fill': 'transparent'
    })


    this.outer.append('.toni');
    this.inner.append('.toni');


};

// var t = new Toni('.ton', {'width': 300});


