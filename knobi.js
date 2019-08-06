(function() {

    'use strict';

    var component = {};

    component.o = function(selector, options) {

        this.o = this.options = options;
        this.internals = {};
        this.dom = {};



        var wrapper = document.createElement('div');

        wrapper.setAttribute('class', 'component ' + this.o.component_name);

        selector.parentNode.appendChild(wrapper);
        wrapper.appendChild(selector);


        this.ui = new SVGObject('svg', {
            'width': this.o.width,
            'height': this.o.height || this.o.width,
            'viewbox': "0 0 " + this.o.width / 10 + " " + this.o.width / 10 + " "
        }, '.' + this.o.component_name);

        this.setup = function(selector) {

            this.createUI(selector);

            if (this.o.show_grid)
                this._showGrid();

            if (this.o.show_xy)
                this._showXY();

            this._listen();
        };


        this.utils = {

            format: (function() {
                function round(v) {
                    return Math.round(v);
                }
                return {
                    parseFloat: parseFloat,
                    parseInt: parseInt,
                    round: round
                }
            }()),

            dom: (function() {
                function get(selector, ctx) {
                    return ctx || document.querySelector(selector);
                }
                return {
                    get: get
                }
            }()),

            events: (function() {

                function handleEvent(type, {
                    el,
                    cb,
                    useCapture = false
                } = {}, params) {

                    const element = el || document.documentElement;

                    function handler(ev) {
                        if (typeof cb === 'function') {
                            cb.call(params, ev)
                        }
                    }

                    handler.destroy = function() {
                        return element.removeEventListener(type, handler, useCapture);
                    }

                    element.addEventListener(type, handler, useCapture);

                    return handler;
                }


                function add(el, type, handler) {
                    if (el.attachEvent) {
                        el.attachEvent('on' + type, handler);
                    } else {
                        el.addEventListener(type, handler);
                    }
                }

                function remove(el, type, handler) {
                    if (el.detachEvent)
                        el.detachEvent('on' + type, handler);
                    else
                        el.removeEventListener(type, handler);
                }

                return {
                    add: add,
                    handleEvent: handleEvent,
                    remove: remove
                }

            }()),

            position: (function() {

                function getCoords(elem) {
                    var box = elem.getBoundingClientRect(),
                        body = document.body,
                        docEl = document.documentElement,
                        scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
                        scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
                        clientTop = docEl.clientTop || body.clientTop || 0,
                        clientLeft = docEl.clientLeft || body.clientLeft || 0;

                    var top = box.top + scrollTop - clientTop;
                    var left = box.left + scrollLeft - clientLeft;

                    return {
                        top: parseFloat(top),
                        left: parseFloat(left)
                    };
                }

                return  {
                    getCoords: getCoords
                }

            }()),

            SVG: (function() {

                function createNode(shape, attr) {

                    var svgNS = "http://www.w3.org/2000/svg";
                    var s = document.createElementNS(svgNS, shape);

                    if (typeof(attr) == 'object') {
                        for (var key in attr) {
                            s.setAttributeNS(null, key, attr[key]);
                        }
                    }
                    return s;
                }

                function append(node, parent) {
                    try {
                        parent.appendChild(node);
                    } catch (e) {
                        console.log('WARNING: parent vaut', parent);
                        console.log('Erreur avec le selecteur : ', node);
                    }
                }

                return {
                    append: append,
                    createNode: createNode
                }

            }())
        }

        this.posX = this.utils.position.getCoords(this.ui.o).left;
        this.posY = this.utils.position.getCoords(this.ui.o).top;


        this._showGrid = function(offset, color) {

            const DRAWER = this.utils.SVG;
            const w = this.options.width;

            let attrX = {},
                attrY = {},
                o = offset ||  10,
                sw = 0.9;


            for (let i = 0; i <= (w / o); i++) {

                attrX['x1'] = attrY['y1'] = i * o;
                attrX['y1'] = attrY['x1'] = 0;

                attrX['x2'] = attrY['y2'] = i * o;
                attrX['y2'] = attrY['x2'] = w;

                attrY['stroke'] = attrX['stroke'] = "#DDD";

                attrX['stroke-width'] = attrY['stroke-width'] = sw;

                let lineX = DRAWER.createNode('line', attrX);
                let lineY = DRAWER.createNode('line', attrY);

                DRAWER.append(lineX, this.ui.o);

                DRAWER.append(lineY, this.ui.o);
            }
        }

        this._showXY = function() {
                let w = this.options.width;

                var y = this.utils.SVG.createNode('line', {
                    'x1': w / 2,
                    'y1': 0,
                    'x2': w / 2,
                    'y2': w,
                    'stroke': 'red',
                    'stroke-width': 0.9
                });
                var x = this.utils.SVG.createNode('line', {
                    'x1': 0,
                    'y1': w / 2,
                    'x2': w,
                    'y2': w / 2,
                    'stroke': 'red',
                    'stroke-width': 0.9
                });

                this.utils.SVG.append(x, this.ui.o);
                this.utils.SVG.append(y, this.ui.o);


            }
            // Setup could be in componenet.proptotype ????
        this.setup(selector);
    }


    // Constructor
    var Knobi = function(selector, options) {

        component.o.apply(this, [selector, options]);
        this.settings = {
            min: 0,
            max: 100,
            step: 1,
            value: 0
        };
        this.radius = this.o.radius;
        this.internals.anglearc = Math.PI * 2;
    }

    Knobi.prototype = {
        createUI: function(selector) {
            const builder = this.utils.SVG;
            var options = this.o;
            const CX = options.width / 2,
                CY = options.width / 2;

            const GROUP = builder.createNode('g', {
                'stroke': options.stroke_color,
                'fill': 'transparent',
                'class': 'knobi'
            });

            const OUTER = builder.createNode('circle', {
                'stroke-width': options.outer_stroke_width || options.radius * 0.01,
                'r': options.radius,
                'cx': CX,
                'cy': CY
            });

            const inner_rad = options.radius * 0.8,
                inner = builder.createNode('circle', {
                    'cy': CY,
                    'cx': CX,
                    'r': inner_rad,
                    'stroke-width': options.radius * 0.08
                });

            /**
             * PROGRESS BAR
             * @type {[type]}
             */
            const progress_rad = options.radius * 0.9;
            this.internals.progress_len = 2 * Math.PI * progress_rad;
            const progress = new SVGObject('circle', {
                'r': progress_rad,
                'id': 'progress',
                'cx': CX,
                'cy': CY,
                'stroke': options.progress_color || '#fc245c',
                'stroke-width': options.radius * 0.09,
                'stroke-linecap': 'round',
                'stroke-dasharray': this.internals.progress_len,
                'stroke-dashoffset': this.internals.progress_len,
                'transform': 'rotate(270 ' + CX + ' ' + CY + ')'
            });

            const cursorxpos = CX - ((options.radius / 5) / 2),
                cursorypos = CY - (options.radius * 0.8),
                CURSOR = new SVGObject('rect', {
                    'class': "cursor",
                    'stroke-width': options.outer_stroke_width,
                    'width': options.radius / 5,
                    'height': options.radius / 4,
                    'x': cursorxpos,
                    'rx': options.radius * 0.05,
                    'ry': options.radius * 0.05,
                    'y': cursorypos,
                    'transform': 'rotate(0 ' + CX + ' ' + CY + ')'
                });

            builder.append(OUTER, GROUP);
            builder.append(inner, GROUP);

            builder.append(progress.o, GROUP);
            builder.append(CURSOR.o, GROUP);
            builder.append(GROUP, this.ui.o);


            this.cursor = CURSOR;
            this.progress = progress;


        },
        _listen: function() {

            let opt = {
                el: this.ui.o,
                cb: (ev) => {

                    ev.preventDefault();
                    this._wheelToVal(ev.deltaY);
                    this._updateSVGDisplay();
                }
            };

            const HANDLEWHEEL = this.utils.events.handleEvent('wheel', opt);

            var ismousedown = false,
                that = this;

            this.utils.events.add(this.ui.o, 'mousedown', function(ev) {
                ev.preventDefault();
                ismousedown = true;
                that._radToVal(that._xyToRad(ev));
                that._updateSVGDisplay();

                that.utils.events.add(that.ui.o, 'mousemove', function(ev) {
                    if (ismousedown) {
                        ev.preventDefault();
                        that._radToVal(that._xyToRad(ev));
                        that._updateSVGDisplay();
                    }
                    return false;
                });

            });

            this.utils.events.add(this.ui.o, 'mouseup', function(ev) {
                that.utils.events.remove(that.ui.o, 'mousedown');
                ismousedown = false;
            });

            // // this.utils.events.add(this.dom.input, 'keydown', function(ev) {
            //     ev.preventDefault();
            //     var keycode = ev.keyCode;
            //     var keyvalue = {
            //             37: -that.settings.step,
            //             38: that.settings.step,
            //             39: that.settings.step,
            //             40: -that.settings.step
            //         },
            //         t, f = 1;


            //     var sense = parseInt(String.fromCharCode(keycode));
            //     if (isNaN(sense)) {
            //         ev.preventDefault();


            //         t = window.setTimeout(function() {
            //             f *= 2;
            //             console.log('30', 30, f);
            //         }, 30);

            //         if ([38, 40, 37, 39].indexOf(keycode) != -1) {
            //             var nVal = (that.settings.value + keyvalue[keycode]) * f;
            //             that.dom.input.value = nVal;
            //             that.settings.value = nVal;
            //         }
            //         that._updateSVGDisplay();
            //     }
            // });
        },

        _xyToRad: function(ev) {

            var r = this.radius;



            var ox = this.posX,
                oy = this.posY,

                ex = ev.pageX,
                ey = ev.pageY;

            var pf = parseFloat;

            var theta = Math.atan2(
                pf(ex) - (pf(ox) + r), -(pf(ey) - pf(oy) - r)
            );
            if (theta < 0)
                theta += Math.PI * 2;

            return theta;
        },

        _radToVal: function(theta) {
            var nVal = this.utils.format.round(theta * this.settings.max / this.internals.anglearc);
            this.settings.value = nVal;
            // this.dom.input.value = nVal;
        },



        _wheelToVal: function(dY) {
            this.settings.value = this.settings.value +
                (dY < 0 ? this.settings.step : dY > 0 ? -this.settings.step : 0);
            this.settings.value = Math.max(Math.min(this.settings.value, this.settings.max), this.settings.min);

            // this.dom.input.value = this.settings.value;
        },

        _updateSVGDisplay: function() {

            this._handleCursorRotation();

        },

        _updateProgress: function(theta) {
            var current_len = theta * (this.options.radius * 0.9);
            console.log(current_len);
            this.progress.o.setAttribute('stroke-dashoffset', this.internals.progress_len - current_len);
        },

        _handleCursorRotation: function() {
            var theta = (this.internals.anglearc / this.settings.max) * this.settings.value;
            this._updateProgress(theta);
            // rad -> Deg
            var ca = Math.round(theta * 180 / Math.PI);

            // Draw
            const CX = this.options.width / 2;
            const CY = CX;

            this.cursor.rotate(ca, CX, CY);
        }

    }

    var Toni = function(selector, options) {

        component.o.apply(this, [selector, options]);
    }

    Toni.prototype = {

        createUI: function(selector) {

            this.group = new SVGObject('g', {
                'class': 'tonig',
                'stroke': '#AAA'
            });

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
            });

            // Inner rect*
            this.inner = new SVGObject('rect', {
                'x': 5,
                'y': 7.5,
                'rx': 3.5,
                'ry': 3.5,
                'width': 83,
                'height': 40,
                'fill': '#eab',
                'fill-opacity': 0.5,
                'stroke-width': 1,
                'stroke-opacity': 1,
                'fill': 'transparent'
            });


            this.group.o.append(this.outer.o);
            this.group.o.append(this.inner.o);


            this.ui.o.append(this.group.o);
        },

        _listen: function() {},
    }



    window.Knobi = Knobi;
    window.Toni = Toni;

}());

var options = {
    'radius': 70,
    'width': 150,
    'outer_stroke_width': 1,
    'stroke_color': '#AAA',
    'component_name': 'knobi',
    // 'show_grid': true,
    'progress_color': '#eab',
    // 'show_xy': true
};


var els = document.querySelectorAll('.knob');
var l = els.length;
var knobies = [];
for (var i = 0; i < l; i++) {
    knobies.push(new Knobi(els[i], options));
}


var sel = document.querySelector('.ton');
var t = new Toni(sel, {
    'width': 300,
    'height': 100,
    'component_name': 'toni'
});
