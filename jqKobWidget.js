/*
jQWidgets v4.5.3 (2017-Jun)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a) {
    a.jqx.jqxWidget("jqxKnob", "", {});
    a.extend(a.jqx._jqxKnob.prototype, {
        defineInstance: function() {
            var b = {
                type: "circle",
                allowValueChangeOnClick: true,
                allowValueChangeOnDrag: true,
                allowValueChangeOnMouseWheel: true,
                changing: null,
                dragEndAngle: -1,
                dragStartAngle: -1,
                disabled: false,
                dial: {
                    style: "transparent",
                    innerRadius: 0,
                    outerRadius: 0,
                    gradientType: null,
                    gradientStops: null,
                    startAngle: null,
                    endAngle: null
                },
                endAngle: 360,
                height: 400,
                labels: {
                    type: "digits",
                    step: null,
                    rotate: false,
                    offset: null,
                    style: "",
                    visible: false
                },
                marks: {
                    type: "",
                    thickness: 1,
                    size: "10%",
                    colorProgress: "transparent",
                    colorRemaining: "transparent",
                    minorInterval: 1,
                    majorInterval: 5,
                    offset: "80%",
                    majorSize: "15%"
                },
                min: 0,
                max: 100,
                progressBar: {
                    size: "10%",
                    offset: "60%",
                    color: "transparent",
                    background: "transparent"
                },
                pointer: {
                    color: {
                        color: "transparent",
                        border: null,
                        gradientType: null,
                        gradientStops: null
                    },
                    thickness: 1,
                    size: "",
                    type: "",
                    visible: false
                },
                pointerGrabAction: "normal",
                renderEngine: "",
                rotation: "clockwise",
                startAngle: 0,
                spinner: {
                    color: "transparent",
                    innerRadius: 0,
                    outerRadius: 0,
                    marks: {
                        step: 1,
                        rotate: false,
                        color: "transparent",
                        size: 0,
                        steps: 10,
                        thickness: 1,
                        offset: 0
                    }
                },
                style: {
                    fill: "transparent",
                    stroke: "transparent"
                },
                _touchEvents: {
                    mousedown: a.jqx.mobile.getTouchEventName("touchstart"),
                    mouseup: a.jqx.mobile.getTouchEventName("touchend"),
                    mousemove: a.jqx.mobile.getTouchEventName("touchmove"),
                    mouseenter: "mouseenter",
                    mouseleave: "mouseleave",
                    click: a.jqx.mobile.getTouchEventName("touchstart")
                },
                step: 1,
                snapToStep: true,
                value: 0,
                width: 400
            };
            if (this === a.jqx._jqxKnob.prototype) {
                return b
            }
            a.extend(true, this, b);
            return b
        },
        createInstance: function() {
            var b = this;
            b._hostInit();
            b._ie8Plugin();
            b._validateProperties();
            b._initValues();
            b._refresh();
            a.jqx.utilities.resize(b.host, function() {
                b.widgetSize = Math.min(b.host.width(), b.host.height());
                b._refresh()
            })
        },
        _getEvent: function(b) {
            if (this._isTouchDevice) {
                return this._touchEvents[b] + ".jqxKnob" + this.element.id
            } else {
                return b + ".jqxKnob" + this.element.id
            }
        },
        _ie8Plugin: function() {
            if (typeof Array.prototype.forEach != "function") {
                Array.prototype.forEach = function(c) {
                    for (var b = 0; b < this.length; b++) {
                        c.apply(this, [this[b], b, this])
                    }
                }
            }
            if (!window.getComputedStyle) {
                window.getComputedStyle = function(b, c) {
                    this.el = b;
                    this.getPropertyValue = function(e) {
                        var d = /(\-([a-z]){1})/g;
                        if (e == "float") {
                            e = "styleFloat"
                        }
                        if (d.test(e)) {
                            e = e.replace(d, function() {
                                return arguments[2].toUpperCase()
                            })
                        }
                        return b.currentStyle[e] ? b.currentStyle[e] : null
                    }
                    ;
                    return this
                }
            }
        },
        createColorGradient: function(c, b, d) {
            return this._getGradient(c, b, d)
        },
        destroy: function() {
            var b = this;
            b.removeHandler(a(document), "mousemove.jqxKnob" + b.host[0].id);
            b.removeHandler(a(document), "blur.jqxKnob" + b.host[0].id);
            b.removeHandler(a(document), "mouseup.jqxKnob" + b.host[0].id);
            b.host.empty();
            b.host.remove()
        },
        propertiesChangedHandler: function(b, c, d) {
            if (d.width && d.height && Object.keys(d).length == 2) {
                b._refresh()
            }
        },
        propertyChangedHandler: function(b, c, f, e) {
            var d = this;
            if (b.batchUpdate && b.batchUpdate.width && b.batchUpdate.height && Object.keys(b.batchUpdate).length == 2) {
                return
            }
            if (c === "disabled") {
                b.host.removeClass(b.toThemeProperty("jqx-fill-state-disabled"))
            }
            if (c === "value") {
                b._setValue(e, "propertyChange");
                return
            }
            b._validateProperties();
            b._refresh()
        },
        val: function(c) {
            var b = this;
            if (arguments.length == 0) {
                return b.value
            }
            b._setValue(c, null)
        },
        _isPointerGrabbed: false,
        _pointerGrabbedIndex: -1,
        _attatchPointerEventHandlers: function() {
            var c = this;
            c.addHandler(c.host, this._getEvent("mousedown"), function(f) {
                if (c.pointerGrabAction === "pointer") {
                    if (f.target.id !== c._pointerID) {
                        return
                    }
                }
                if (c._isTouchDevice) {
                    var i = a.jqx.position(f);
                    f.clientX = i.left;
                    f.clientY = i.top
                }
                if (c.pointerGrabAction === "progressBar") {
                    var l = {
                        x: f.clientX,
                        y: f.clientY
                    };
                    var h = c.host[0].getBoundingClientRect();
                    var k = c.widgetSize;
                    var d = {
                        x: h.left + k / 2,
                        y: h.top + k / 2
                    };
                    var g = c._calculateAngleFromCoordinates(l, d, c.rotation);
                    var e = c._calculateDistance(l, d);
                    if (g < c.startAngle) {
                        g += 360
                    }
                    if (g > c.endAngle) {
                        if (g - c.endAngle !== (360 + c.startAngle - g)) {
                            return
                        }
                    }
                    var j = c._getScale(c.progressBar.offset, "w", k / 2);
                    var m = c._getScale(c.progressBar.size, "w", k / 2);
                    if (e < j || e > j + m) {
                        return
                    }
                }
                c._isPointerGrabbed = true;
                if (c.allowValueChangeOnClick === true) {
                    c._mouseMovePointer(f)
                }
                f.preventDefault();
                f.stopPropagation();
                return false
            });
            var b = null;
            c.addHandler(a(document), this._getEvent("mousemove"), function(d) {
                if (c.allowValueChangeOnDrag) {
                    if (b) {
                        clearTimeout(b)
                    }
                    b = setTimeout(function() {
                        c._mouseMovePointer(d)
                    });
                    if (c._isPointerGrabbed) {
                        return false
                    }
                }
            });
            c.addHandler(a(document), "blur.jqxKnob" + c.host[0].id, function() {
                c._isPointerGrabbed = false;
                c._pointerGrabbedIndex = -1
            });
            c.addHandler(a(document), this._getEvent("mouseup"), function(d) {
                if (c._isPointerGrabbed) {
                    c._isPointerGrabbed = false;
                    c._pointerGrabbedIndex = -1;
                    c._raiseEvent(0, {
                        originalEvent: d,
                        value: c.value
                    })
                }
            });
            c.addHandler(c.host, "wheel", function(d) {
                if (c.allowValueChangeOnMouseWheel) {
                    var e = 0;
                    if (!d) {
                        d = window.event
                    }
                    if (d.originalEvent && d.originalEvent.wheelDelta) {
                        d.wheelDelta = d.originalEvent.wheelDelta
                    }
                    if (d.wheelDelta) {
                        e = d.wheelDelta / 120
                    } else {
                        if (d.detail) {
                            e = -d.detail / 3
                        } else {
                            if (d.originalEvent && d.originalEvent.deltaY) {
                                e = d.originalEvent.deltaY
                            }
                        }
                    }
                    if (e > 0) {
                        c._increment()
                    } else {
                        c._decrement()
                    }
                    return false
                }
            })
        },
        _mouseMovePointer: function(c) {
            var h = this;
            if (h.disabled) {
                return
            }
            if (h._isPointerGrabbed) {
                if (h._isTouchDevice) {
                    var l = a.jqx.position(c);
                    c.clientX = l.left;
                    c.clientY = l.top
                }
                var p = {
                    x: c.clientX,
                    y: c.clientY
                };
                var k = h.host[0].getBoundingClientRect();
                var o = h.widgetSize;
                var b = {
                    x: k.left + o / 2,
                    y: k.top + o / 2
                };
                var f = h._calculateAngleFromCoordinates(p, b, h.rotation);
                var n = h._calculateValueFromAngle(f, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                if (h.value.length) {
                    if (h._pointerGrabbedIndex === -1) {
                        for (var g = 0; g < h.value.length; g++) {
                            if (n <= h.value[g]) {
                                h._pointerGrabbedIndex = g;
                                break
                            } else {
                                if (g === h.value.length - 1) {
                                    h._pointerGrabbedIndex = g
                                } else {
                                    if (n <= h.value[g + 1]) {
                                        var m = h.value[g] + (h.value[g + 1] - h.value[g]) / 2;
                                        h._pointerGrabbedIndex = n <= m ? g : g + 1;
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                if (h.pointer && h.pointer.length > 1) {
                    if (h._pointerGrabbedIndex == 1) {
                        var j = h._calculateAngleFromValue(h.value[0], h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        var e = h._calculateAngleFromValue(h.max, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        var f = h._calculateAngleFromValue(n, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        if (f <= j) {
                            return
                        }
                        if (f >= e) {
                            return
                        }
                    }
                    if (h._pointerGrabbedIndex == 0) {
                        var e = h._calculateAngleFromValue(h.value[1], h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        var j = h._calculateAngleFromValue(h.min, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        var f = h._calculateAngleFromValue(n, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
                        if (f <= j) {
                            return
                        }
                        if (f >= e) {
                            return
                        }
                    }
                }
                if (h.changing) {
                    var d = h.value.slice(0);
                    d[h._pointerGrabbedIndex] = n;
                    var q = h.changing(h.value, d);
                    if (q === false) {
                        return
                    }
                }
                h._setValue(n, "mouse")
            }
        },
        _getScale: function(b, d, c) {
            if (b && b.toString().indexOf("%") >= 0) {
                b = parseInt(b, 10) / 100;
                if (typeof (c) == "object") {
                    return c[d]() * b
                } else {
                    return c * b
                }
            }
            return parseInt(b, 10)
        },
        _hostInit: function() {
            var c = this;
            this._isTouchDevice = a.jqx.mobile.isTouchDevice();
            var b = c.host;
            b.width(c.width);
            b.height(c.height);
            b.css("position", "relative");
            c.host.addClass(c.toThemeProperty("jqx-widget jqx-knob"));
            if (c.dragStartAngle == -1) {
                c.dragStartAngle = c.startAngle
            }
            if (c.dragEndAngle == -1) {
                c.dragEndAngle = c.endAngle
            }
            if (c.dragStartAngle < c.startAngle) {
                c.dragStartAngle = c.startAngle
            }
            if (c.dragEndAngle > c.endAngle) {
                c.dragEndAngle = c.endAngle
            }
            c.widgetSize = Math.min(c.host.width(), c.host.height())
        },
        _initRenderer: function(b) {
            if (!a.jqx.createRenderer) {
                throw "jqxKnob: Please include a reference to jqxdraw.js"
            }
            return a.jqx.createRenderer(this, b)
        },
        _initValues: function() {
            var b = this;
            if (b.marks) {
                if (b.marks.style && b.marks.style !== "") {
                    if (b.marks.style === "line" && !b.marks.thickness) {
                        b.marks.thickness = 1
                    }
                    if (!b.marks.size) {
                        b.marks.size = "5%"
                    }
                    if (!b.marks.offset) {
                        b.marks.offset = "85%"
                    }
                }
                if (b.marks.majorInterval) {
                    if (b.marks.majorSize === undefined) {
                        b.marks.majorSize = "10%"
                    }
                }
            }
            b._marksList = b._getMarksArray(b.marks);
            if (b.spinner) {
                b._spinnerMarksList = b._getMarksArray(b.spinner.marks)
            }
        },
        _calculateAngleFromValue: function(e, c, b, d, f) {
            if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                if (this.type != "circle") {
                    return d != f ? parseInt((e - d) / (f - d)) : 0
                }
                return d != f ? parseInt((e - d) / (f - d) * (b - c)) : 0
            }
            if (this.type != "circle") {
                return d != f ? (e - d) / (f - d) : 0
            }
            return d != f ? (e - d) / (f - d) * (b - c) : 0
        },
        _calculateAngleFromCoordinates: function(d, c, e) {
            var b = d.x - c.x;
            var f = d.y - c.y;
            if (f > 0) {
                return e === "clockwise" ? 90 - Math.atan(b / f) * 180 / Math.PI : 270 + Math.atan(b / f) * 180 / Math.PI
            } else {
                if (f < 0) {
                    return e === "clockwise" ? 270 - Math.atan(b / f) * 180 / Math.PI : 90 + Math.atan(b / f) * 180 / Math.PI
                } else {
                    if (b >= 0) {
                        return 0
                    } else {
                        return 180
                    }
                }
            }
        },
        _calculateValueFromAngle: function(g, e, c, d, b) {
            if (g < e) {
                g += 360
            }
            var f = d;
            if (g > c) {
                if (g - c < (360 + e - g)) {
                    f = b
                }
            } else {
                f = d + (g - e) * (b - d) / (c - e)
            }
            return f
        },
        _calculateDistance: function(c, b) {
            return Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2))
        },
        _drawBackground: function() {
            var f = this;
            var g = f.renderer;
            var e, b, c;
            e = f.widgetSize;
            b = e / 2;
            var h = f.style.strokeWidth ? f.style.strokeWidth : 0;
            b -= h / 2;
            if (f.style) {
                var c = f._getColor(f.style.fill);
                var d = f._getColor(f.style.stroke);
                var h = f.style.strokeWidth ? f.style.strokeWidth : 1;
                if (f.type != "circle") {
                    g.rect(0, 0, this.host.width(), this.host.height(), {
                        fill: c,
                        stroke: d,
                        "stroke-width": h
                    })
                } else {
                    g.circle(e / 2, e / 2, b, {
                        fill: c,
                        stroke: d,
                        "stroke-width": h
                    })
                }
            }
        },
        _drawDial: function() {
            var j = this;
            if (j.dial) {
                var l = j.renderer;
                var c = j.widgetSize;
                var h, e, m, i, k, d, n = 0, g;
                h = e = c / 2;
                i = j._getScale(j.dial.outerRadius, "w", c / 2);
                m = j._getScale(j.dial.innerRadius, "w", c / 2);
                if (j.dial.startAngle != null && j.dial.endAngle != null) {
                    k = j.rotation === "clockwise" ? 360 - j.dial.endAngle : j.dial.startAngle;
                    d = j.rotation === "clockwise" ? 360 - j.dial.startAngle : j.dial.endAngle
                } else {
                    k = j.rotation === "clockwise" ? 360 - j.endAngle : j.startAngle;
                    d = j.rotation === "clockwise" ? 360 - j.startAngle : j.endAngle
                }
                g = j._getColor(j.dial.style.fill);
                var f = j._getColor(j.dial.style.stroke) || "";
                var b = j.dial.style.strokeWidth || 0;
                l.pieslice(h, e, m, i, k, d, n, {
                    fill: g,
                    stroke: f,
                    "stroke-width": b
                })
            }
        },
        _getMarksArray: function(f) {
            if (f == undefined) {
                return []
            }
            var k = this, h, n, m = {}, l = k.max, g = k.min, j = l - g, c = f.minorInterval, b = f.majorInterval;
            var e = function(i) {
                return ( parseFloat(i.toPrecision(12)))
            };
            if (c) {
                for (h = 0; h < j; h += c) {
                    n = e(g + h);
                    m[n] = {
                        type: "minor"
                    }
                }
                m[l] = {
                    type: "minor"
                }
            }
            if (b) {
                for (h = 0; h < j; h += b) {
                    n = e(g + h);
                    m[n] = {
                        type: "major"
                    }
                }
                m[l] = {
                    type: "major"
                }
            }
            if (!c && !b) {
                var d = k.step;
                if (d) {
                    for (h = 0; h < j; h += d) {
                        n = e(g + h);
                        m[n] = {
                            type: "minor"
                        }
                    }
                    m[l] = {
                        type: "minor"
                    }
                }
            }
            return m
        },
        _drawMarks: function() {
            var g = this;
            if (g.marks) {
                var h = g.renderer;
                var b = g.widgetSize;
                var e = g.marks && g.marks.colorRemaining != null ? g.marks.colorRemaining : "transparent";
                e = g._getColor(e);
                g._dialMarks = [];
                var j, c;
                var i = g.marks.type;
                if (!i) {
                    i = "line"
                }
                var f = g._getScale(g.marks.offset, "w", b / 2);
                var d = g._marksList;
                a.each(d, function(o, q) {
                    if (g.dragEndAngle - g.dragStartAngle === 360) {
                        if (o == g.max) {
                            return
                        }
                    }
                    c = g.dragStartAngle + g._calculateAngleFromValue(o, g.dragStartAngle, g.dragEndAngle, g.min, g.max);
                    if (i === "circle") {
                        var l = g._getScale(g.marks.size, "w", b / 2);
                        var k = g._getPointerPosition({
                            x: b / 2,
                            y: b / 2
                        }, f, c, g.rotation);
                        g._dialMarks.push(h.circle(k.x, k.y, l, {
                            fill: e
                        }))
                    } else {
                        if (i === "line") {
                            if (q.type === "major" && g.marks.majorSize !== null && g.marks.majorSize !== undefined) {
                                j = g._getScale(g.marks.majorSize, "w", b / 2)
                            } else {
                                j = g._getScale(g.marks.size, "w", b / 2)
                            }
                            var n = g._getScale(g.marks.thickness, "w", b / 2);
                            var p = g._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f, c, g.rotation);
                            var m = g._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f + j, c, g.rotation);
                            if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                                g._dialMarks.push(h.line(parseInt(p.x), parseInt(p.y), parseInt(m.x), parseInt(m.y), {
                                    stroke: e,
                                    "stroke-width": n
                                }))
                            } else {
                                g._dialMarks.push(h.line(p.x, p.y, m.x, m.y, {
                                    stroke: e,
                                    "stroke-width": n
                                }))
                            }
                        }
                    }
                })
            }
        },
        _drawProgressBars: function() {
            var h = this;
            if (h.progressBar) {
                h._progressBar = h._progressBar || [];
                for (var g = 0; g < h._progressBar.length; g++) {
                    a(h._progressBar[g]).remove()
                }
                h._progressBar = [];
                if (h._isArray(h.progressBar.style)) {
                    var f = h.value[0];
                    var c = h.value[1];
                    var e = h.progressBar.style[0];
                    var b = h.progressBar.style[1];
                    h._progressBar.push(h._drawProgressBar(h.max, h.progressBar.background, "background"));
                    if (h.progressBar.ranges) {
                        for (var g = 0; g < h.progressBar.ranges.length; g++) {
                            var j = h.progressBar.ranges[g].startValue;
                            var d = h.progressBar.ranges[g].endValue;
                            h._progressBar.push(h._drawProgressBarFromToValue(j, d, h.progressBar.ranges[g], "background"))
                        }
                    }
                    h._progressBar.push(h._drawProgressBar(f, e));
                    h._progressBar.push(h._drawProgressBarFromEndToStart(c, b))
                } else {
                    h._progressBar.push(h._drawProgressBar(h.max, h.progressBar.background, "background"));
                    if (h.progressBar.ranges) {
                        for (var g = 0; g < h.progressBar.ranges.length; g++) {
                            var j = h.progressBar.ranges[g].startValue;
                            var d = h.progressBar.ranges[g].endValue;
                            h._progressBar.push(h._drawProgressBarFromToValue(j, d, h.progressBar.ranges[g], "background"))
                        }
                    }
                    h._progressBar.push(h._drawProgressBar(h.value, h.progressBar.style))
                }
            }
        },
        _drawProgressBarFromEndToStart: function(m, p) {
            var g = this;
            var n = g.renderer;
            var l = g.widgetSize;
            var h, s;
            var e = g._getScale(g.progressBar.offset, "w", l / 2);
            var d, c, f, o, q, k, b = 0;
            h = g._getScale(g.progressBar.size, "w", l / 2);
            d = c = l / 2;
            f = e;
            o = e + h;
            var r = g._getColor(p.fill) || "transparent";
            var j = g._getColor(p.stroke) || "transparent";
            s = g.dragStartAngle + g._calculateAngleFromValue(m, g.dragStartAngle, g.dragEndAngle, g.min, g.max);
            q = g.dragStartAngle;
            var i = p.strokeWidth ? p.strokeWidth : 1;
            if (g.endAngle != s) {
                if (g.rotation === "clockwise") {
                    return ( n.pieslice(d, c, f, o, 360 - g.endAngle, 360 - s, b, {
                        fill: r,
                        stroke: j,
                        "stroke-width": i
                    }))
                } else {
                    return ( n.pieslice(d, c, f, o, k, s, b, {
                        fill: r,
                        stroke: j,
                        "stroke-width": i
                    }))
                }
            }
        },
        _drawProgressBarFromToValue: function(m, b, u, f) {
            var k = this;
            var s = k.renderer;
            var r = k.widgetSize;
            var l, y;
            var g = k._getScale(k.progressBar.offset, "w", r / 2);
            var e, d, j, t, v, q, c = 0;
            l = k._getScale(k.progressBar.size, "w", r / 2);
            e = d = r / 2;
            j = g;
            t = g + l;
            var x = k._getColor(u.fill) || "transparent";
            var p = k._getColor(u.stroke) || "transparent";
            y = k.dragStartAngle + k._calculateAngleFromValue(b, k.dragStartAngle, k.dragEndAngle, k.min, k.max);
            v = k.dragStartAngle + k._calculateAngleFromValue(m, k.dragStartAngle, k.dragEndAngle, k.min, k.max);
            if (v == y) {
                return
            }
            var o = 1;
            if (f == "background") {
                o = 0
            }
            var n = u.strokeWidth ? u.strokeWidth : o;
            if (k.type != "circle") {
                if (k.type == "rect") {
                    var w = y * (this.host.height() - 2 * g);
                    var i = (this.host.height() - 2 * g);
                    return ( s.rect(e - l / 2, g + i - w, l, w, {
                        fill: x,
                        stroke: p,
                        "stroke-width": n
                    }))
                } else {
                    return ( s.rect(g, d - l / 2, this.host.width() - 2 * g, l, {
                        fill: x,
                        stroke: p,
                        "stroke-width": n
                    }))
                }
            }
            if (k.rotation === "clockwise") {
                return ( s.pieslice(e, d, j, t, 360 - y, 360 - v, c, {
                    fill: x,
                    stroke: p,
                    "stroke-width": n
                }))
            } else {
                return ( s.pieslice(e, d, j, t, v, y, c, {
                    fill: x,
                    stroke: p,
                    "stroke-width": n
                }))
            }
        },
        _drawProgressBar: function(q, t, e) {
            var j = this;
            var r = j.renderer;
            var p = j.widgetSize;
            var k, x;
            var f = j._getScale(j.progressBar.offset, "w", p / 2);
            var d, c, i, s, u, o, b = 0;
            k = j._getScale(j.progressBar.size, "w", p / 2);
            d = c = p / 2;
            i = f;
            s = f + k;
            var w = j._getColor(t.fill) || "transparent";
            var n = j._getColor(t.stroke) || "transparent";
            x = j.dragStartAngle + j._calculateAngleFromValue(q, j.dragStartAngle, j.dragEndAngle, j.min, j.max);
            u = j.dragStartAngle;
            if (u == x) {
                return
            }
            var m = 1;
            if (e == "background") {
                m = 0
            }
            var l = t.strokeWidth ? t.strokeWidth : m;
            if (j.type != "circle") {
                if (j.type == "rect") {
                    var v = x * (this.host.height() - 2 * f);
                    var g = (this.host.height() - 2 * f);
                    return ( r.rect(d - k / 2, f + g - v, k, v, {
                        fill: w,
                        stroke: n,
                        "stroke-width": l
                    }))
                } else {
                    return ( r.rect(f, c - k / 2, this.host.width() - 2 * f, k, {
                        fill: w,
                        stroke: n,
                        "stroke-width": l
                    }))
                }
            }
            if (j.rotation === "clockwise") {
                return ( r.pieslice(d, c, i, s, 360 - x, 360 - u, b, {
                    opacity: t.opacity || 1,
                    fill: w,
                    stroke: n,
                    "stroke-width": l
                }))
            } else {
                return ( r.pieslice(d, c, i, s, u, x, b, {
                    opacity: t.opacity || 1,
                    fill: w,
                    stroke: n,
                    "stroke-width": l
                }))
            }
        },
        _drawLabels: function() {
            var o = this;
            o._labels = [];
            var p = o.renderer;
            var d = o.widgetSize;
            if (o.labels.visible === undefined) {
                o.labels.visible = true
            }
            if (o.labels.visible === true) {
                var l = o._getScale(o.labels.offset, "w", d / 2);
                var r = o.labels.type ? o.labels.type : "digits";
                var c = o.labels.style;
                var k = c && c.fill ? o._getColor(c.fill) : "#333";
                var m;
                if (r === "digits") {
                    var n = [];
                    if (o.labels.customLabels) {
                        for (m = 0; m < o.labels.customLabels.length; m++) {
                            n.push(o.labels.customLabels[m].value)
                        }
                    } else {
                        var g = o.labels.step || o.step;
                        for (m = o.min; m < o.max; m += g) {
                            n.push(m)
                        }
                        if (o.dragEndAngle - 360 < o.dragStartAngle) {
                            n.push(o.max)
                        }
                    }
                    for (m = 0; m < n.length; m++) {
                        var h = o.labels.customLabels ? o.labels.customLabels[m].text : n[m].toString();
                        if (o.labels.formatFunction) {
                            h = o.labels.formatFunction(h)
                        }
                        var e = o.dragStartAngle;
                        var f = o.dragEndAngle;
                        var j = e + o._calculateAngleFromValue(n[m], e, f, o.min, o.max);
                        var s = o._getPointerPosition({
                            x: d / 2,
                            y: d / 2
                        }, l, j, o.rotation);
                        if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                            var b = p.measureText(h, 0, {
                                "class": this.toThemeProperty("jqx-knob-label")
                            });
                            var q = o.labels.rotate ? 90 - j : 0;
                            p.text(h, s.x - b.width / 2, s.y - b.height / 2, b.width, b.height, q, {
                                "class": this.toThemeProperty("jqx-knob-label")
                            }, false)
                        } else {
                            var b = p.measureText(h, 0, {
                                style: {
                                    fill: k
                                },
                                "class": this.toThemeProperty("jqx-knob-label")
                            });
                            var q = o.labels.rotate ? 90 - j : 0;
                            p.text(h, s.x - b.width / 2, s.y - b.height / 2, b.width, b.height, q, {
                                style: {
                                    fill: k
                                },
                                "class": this.toThemeProperty("jqx-knob-label")
                            }, false)
                        }
                    }
                }
            }
        },
        _drawPointers: function() {
            var c = this;
            c._pointers = c._pointers || [];
            c._pointers.forEach(function(f, e, d) {
                a(f).remove();
                d.splice(e, 1)
            });
            if (c.pointer) {
                if (c._isArray(c.pointer)) {
                    for (var b = 0; b < c.progressBar.style.length; b++) {
                        if (c.pointer[b].visible === false) {
                            continue
                        }
                        c._pointers.push(c._drawPointer(c.value[b], c.pointer[b]))
                    }
                } else {
                    if (c.pointer.visible === false) {
                        return
                    }
                    c._pointers.push(c._drawPointer(c.value, c.pointer))
                }
            }
        },
        _drawPointer: function(u, m) {
            var l = this;
            m.id = m.id || l._getID();
            var v = l.renderer;
            var t = l.widgetSize;
            var f = m.type;
            if (!f) {
                f = "circle"
            }
            if (!m.style) {
                m.style = {
                    fill: "#feaf4e",
                    stroke: "#feaf4e"
                }
            }
            var y = l._getColor(m.style.fill);
            var x = m.style.stroke || "";
            var p, b;
            var g;
            var j = l._getScale(m.offset, "w", t / 2);
            var B = l.dragStartAngle + l._calculateAngleFromValue(u, l.dragStartAngle, l.dragEndAngle, l.min, l.max);
            if (f === "circle") {
                var h = l._getScale(m.size, "w", t / 2);
                var E = l._getPointerPosition({
                    x: t / 2,
                    y: t / 2
                }, j, B, l.rotation);
                g = v.circle(E.x, E.y, h, {
                    id: m.id,
                    fill: y,
                    stroke: x
                })
            } else {
                if (f === "line") {
                    p = l._getScale(m.size, "w", t / 2);
                    b = m.thickness;
                    var q = l._getPointerPosition({
                        x: t / 2,
                        y: t / 2
                    }, j, B, l.rotation);
                    var r = l._getPointerPosition({
                        x: t / 2,
                        y: t / 2
                    }, j + p, B, l.rotation);
                    g = v.line(q.x, q.y, r.x, r.y, {
                        id: m.id,
                        stroke: y,
                        "stroke-width": b
                    })
                } else {
                    if (f === "arc") {
                        p = l._getScale(m.size, "w", t / 2);
                        var e, d, k, w, z, s, c = 0;
                        var o = (l.dragEndAngle - l.dragStartAngle) / l._steps.length;
                        e = d = t / 2;
                        k = j;
                        w = j + p;
                        z = l.rotation === "clockwise" ? 360 - (B + o / 2) : B - o / 2;
                        s = l.rotation === "clockwise" ? 360 - (B - o / 2) : B + o / 2;
                        g = v.pieslice(e, d, k, w, z, s, c, {
                            id: m.id,
                            fill: y,
                            stroke: x
                        })
                    } else {
                        if (f === "arrow") {
                            p = l._getScale(m.size, "w", t / 2);
                            b = m.thickness;
                            var n = l._getPointerPosition({
                                x: t / 2,
                                y: t / 2
                            }, p, B, l.rotation);
                            var i = l._getPointerPosition({
                                x: t / 2,
                                y: t / 2
                            }, j, B, l.rotation);
                            var D = l._getPointerPosition({
                                x: i.x,
                                y: i.y
                            }, b / 2, B - 90, l.rotation);
                            var C = l._getPointerPosition({
                                x: i.x,
                                y: i.y
                            }, b / 2, B + 90, l.rotation);
                            var A = "M " + n.x + "," + n.y + " L " + D.x + "," + D.y + " L " + C.x + "," + C.y + " " + n.x + "," + n.y;
                            g = this.renderer.path(A, {
                                id: m.id,
                                stroke: x,
                                fill: y
                            })
                        }
                    }
                }
            }
            return g
        },
        _rotateSpinnerMarks: function(j) {
            var h = this;
            var m = h.spinner.marks;
            if (m) {
                if (m.rotate === false) {
                    return
                }
                var k = h.renderer;
                var b = h.widgetSize;
                var e = m && m.colorRemaining != null ? m.colorRemaining : "transparent";
                e = h._getColor(e);
                var n, c;
                var l = m.type;
                if (!l) {
                    l = "line"
                }
                var f = h._getScale(m.offset, "w", b / 2);
                for (var g = 0; g < h._spinnerMarks.length; g++) {
                    a(h._spinnerMarks[g]).remove()
                }
                h._spinnerMarks = [];
                var d = h._spinnerMarksList;
                a.each(d, function(r, t) {
                    if (h.endAngle - h.startAngle === 360) {
                        if (r == h.max) {
                            return
                        }
                    }
                    c = j + h._calculateAngleFromValue(r, h.startAngle, h.endAngle, h.min, h.max);
                    if (c < h.startAngle) {
                        return true
                    }
                    if (c > h.endAngle && c < h.startAngle + 360) {
                        return true
                    }
                    if (l === "circle") {
                        var o = h._getScale(m.size, "w", b / 2);
                        var i = h._getPointerPosition({
                            x: b / 2,
                            y: b / 2
                        }, f, c, h.rotation);
                        h._spinnerMarks.push(k.circle(i.x, i.y, o, {
                            fill: e
                        }))
                    } else {
                        if (l === "line") {
                            if (t.type === "major" && m.majorSize !== null && m.majorSize !== undefined) {
                                n = h._getScale(m.majorSize, "w", b / 2)
                            } else {
                                n = h._getScale(m.size, "w", b / 2)
                            }
                            var q = h._getScale(m.thickness, "w", b / 2);
                            var s = h._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f, c, h.rotation);
                            var p = h._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f + n, c, h.rotation);
                            h._spinnerMarks.push(k.line(s.x, s.y, p.x, p.y, {
                                stroke: e,
                                "stroke-width": q
                            }))
                        }
                    }
                })
            }
        },
        _drawSpinnerMarks: function(j) {
            var g = this;
            if (j) {
                var h = g.renderer;
                var b = g.widgetSize;
                var e = j && j.colorRemaining != null ? j.colorRemaining : "transparent";
                e = g._getColor(e);
                g._spinnerMarks = [];
                var k, c;
                var i = j.type;
                if (!i) {
                    i = "line"
                }
                var f = g._getScale(j.offset, "w", b / 2);
                var d = g._spinnerMarksList;
                a.each(d, function(p, r) {
                    if (g.dragEndAngle - g.dragStartAngle === 360) {
                        if (p == g.max) {
                            return
                        }
                    }
                    c = g.startAngle + g._calculateAngleFromValue(p, g.startAngle, g.endAngle, g.min, g.max);
                    if (i === "circle") {
                        var m = g._getScale(j.size, "w", b / 2);
                        var l = g._getPointerPosition({
                            x: b / 2,
                            y: b / 2
                        }, f, c, g.rotation);
                        g._spinnerMarks.push(h.circle(l.x, l.y, m, {
                            fill: e
                        }))
                    } else {
                        if (i === "line") {
                            if (r.type === "major" && j.majorSize !== null && j.majorSize !== undefined) {
                                k = g._getScale(j.majorSize, "w", b / 2)
                            } else {
                                k = g._getScale(j.size, "w", b / 2)
                            }
                            var o = g._getScale(j.thickness, "w", b / 2);
                            var q = g._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f, c, g.rotation);
                            var n = g._getPointerPosition({
                                x: b / 2,
                                y: b / 2
                            }, f + k, c, g.rotation);
                            g._spinnerMarks.push(h.line(q.x, q.y, n.x, n.y, {
                                stroke: e,
                                "stroke-width": o
                            }))
                        }
                    }
                })
            }
        },
        _drawSpinner: function() {
            var g = this;
            if (g.spinner) {
                var o = g.renderer;
                var n = g.widgetSize;
                if (!g.spinner.style) {
                    g.spinner.style = {
                        fill: "#dfe3e9",
                        stroke: "#dfe3e9"
                    }
                }
                var r = g._getColor(g.spinner.style.fill);
                var q = g.spinner.style.stroke || "";
                var d, c;
                d = c = n / 2;
                var p = g._getScale(g.spinner.outerRadius, "w", n / 2);
                var f = g._getScale(g.spinner.innerRadius, "w", n / 2);
                var m = r.strokeWidth ? r.strokeWidth : 2;
                o.pieslice(d, c, f, p, 360 - g.endAngle, 360 - g.startAngle, 0, {
                    "stroke-width": m,
                    fill: r,
                    stroke: q
                });
                if (g.spinner.marks) {
                    g._drawSpinnerMarks(g.spinner.marks);
                    return;
                    g._spinnerMarks = [];
                    var k, b, h;
                    k = g._getScale(g.spinner.marks.size, "w", n / 2);
                    b = g._getScale(g.spinner.marks.thickness, "w", n / 2);
                    var e = g._getScale(g.spinner.marks.offset, "w", n / 2);
                    var t = 0;
                    a.each(g._spinnerMarksList, function(i, v) {
                        t++
                    });
                    h = g._getColor(g.spinner.marks.colorRemaining);
                    var u;
                    for (var s = 0; s < t; s++) {
                        u = g.startAngle + s / t * g.dragEndAngle;
                        var j = g._getPointerPosition({
                            x: n / 2,
                            y: n / 2
                        }, e, u, g.rotation);
                        var l = g._getPointerPosition({
                            x: n / 2,
                            y: n / 2
                        }, e + k, u, g.rotation);
                        g._spinnerMarks.push(o.line(j.x, j.y, l.x, l.y, {
                            stroke: h,
                            "stroke-width": b
                        }))
                    }
                }
            }
        },
        _getColor: function(b) {
            if (b && typeof (b) === "object") {
                return this._getGradient(b.color, b.gradientType, b.gradientStops)
            }
            return b
        },
        _getGradient: function(b, c, d) {
            if (c && d != null && typeof (d) === "object") {
                if (c === "linear") {
                    b = this.renderer._toLinearGradient(b, true, d)
                } else {
                    if (c === "linearHorizontal") {
                        b = this.renderer._toLinearGradient(b, false, d)
                    } else {
                        if (c === "radial") {
                            b = this.renderer._toRadialGradient(b, d)
                        }
                    }
                }
            }
            return b
        },
        _isArray: function(b) {
            return Object.prototype.toString.call(b) === "[object Array]"
        },
        _events: ["slide", "change"],
        _raiseEvent: function(d, b) {
            var c = this._events[d]
              , e = a.Event(c);
            e.args = b;
            return this.host.trigger(e)
        },
        _movePointers: function() {
            var c = this;
            var d;
            for (var b = 0; b < c._pointers.length; b++) {
                if (c._pointers.length !== 1) {
                    d = c.dragStartAngle + c._calculateAngleFromValue(c.value[b], c.dragStartAngle, c.dragEndAngle, c.min, c.max);
                    c._pointers[b] = c._movePointer(c._pointers[b], c.pointer[b], d, c.value[b])
                } else {
                    d = c.dragStartAngle + c._calculateAngleFromValue(c.value, c.dragStartAngle, c.dragEndAngle, c.min, c.max);
                    c._pointers[0] = c._movePointer(c._pointers[0], c.pointer, d, c.value)
                }
            }
        },
        _movePointer: function(d, h, q, n) {
            var g = this;
            var o = g.renderer;
            var m = g.widgetSize;
            var j;
            var c = h.type;
            if (!c) {
                c = "circle"
            }
            var f = g._getScale(h.offset, "w", m / 2);
            if (c === "circle") {
                var t = g._getPointerPosition({
                    x: m / 2,
                    y: m / 2
                }, f, q, g.rotation);
                o.attr(d, {
                    cx: t.x,
                    cy: t.y
                });
                if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                    a("#" + h.id).remove();
                    d = g._drawPointer(n, h)
                }
            } else {
                if (c === "line") {
                    j = g._getScale(h.size, "w", m / 2);
                    var k = g._getPointerPosition({
                        x: m / 2,
                        y: m / 2
                    }, f, q, g.rotation);
                    var l = g._getPointerPosition({
                        x: m / 2,
                        y: m / 2
                    }, f + j, q, g.rotation);
                    o.attr(d, {
                        x1: k.x,
                        y1: k.y,
                        x2: l.x,
                        y2: l.y
                    });
                    if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                        a("#" + h.id).remove();
                        d = g._drawPointer(n, h)
                    }
                } else {
                    if (c === "arrow") {
                        j = g._getScale(h.size, "w", m / 2);
                        var b = h.thickness;
                        var i = g._getPointerPosition({
                            x: m / 2,
                            y: m / 2
                        }, j, q, g.rotation);
                        var e = g._getPointerPosition({
                            x: m / 2,
                            y: m / 2
                        }, f, q, g.rotation);
                        var s = g._getPointerPosition({
                            x: e.x,
                            y: e.y
                        }, b / 2, q - 90, g.rotation);
                        var r = g._getPointerPosition({
                            x: e.x,
                            y: e.y
                        }, b / 2, q + 90, g.rotation);
                        var p = "M " + i.x + "," + i.y + " L " + s.x + "," + s.y + " L " + r.x + "," + r.y + " " + i.x + "," + i.y;
                        o.attr(d, {
                            d: p
                        });
                        if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                            a("#" + h.id).remove();
                            d = g._drawPointer(n, h)
                        }
                    } else {
                        if (c === "arc") {
                            a("#" + h.id).remove();
                            d = g._drawPointer(h)
                        }
                    }
                }
            }
            if (g.progressBar) {
                d.parentNode.appendChild(d.parentNode.removeChild(d))
            }
            return d
        },
        _getPointerPosition: function(c, b, e, d) {
            if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                return {
                    x: parseInt(c.x + b * Math.sin(Math.PI / 180 * (e + 90))),
                    y: d === "clockwise" ? parseInt(c.y + b * Math.sin(Math.PI / 180 * (e))) : parseInt(c.y - b * Math.sin(Math.PI / 180 * (e)))
                }
            }
            return {
                x: c.x + b * Math.sin(Math.PI / 180 * (e + 90)),
                y: d === "clockwise" ? c.y + b * Math.sin(Math.PI / 180 * (e)) : c.y - b * Math.sin(Math.PI / 180 * (e))
            }
        },
        _getID: function() {
            var b = function() {
                return ( ((1 + Math.random()) * 16) | 0)
            };
            return ( "" + b() + b() + "-" + b() + "-" + b() + "-" + b() + "-" + b() + b() + b())
        },
        _decrement: function() {
            this._setValue(this.value - this.step, "mouse")
        },
        _increment: function() {
            this._setValue(this.value + this.step, "mouse")
        },
        _refresh: function() {
            var c = this;
            if (c.disabled) {
                c.host.addClass(c.toThemeProperty("jqx-fill-state-disabled"))
            }
            if (!c.renderer) {
                c._isVML = false;
                c.host.empty();
                c._initRenderer(c.host)
            }
            c.removeHandler(a(document), "mousemove.jqxKnob" + c.host[0].id);
            c.removeHandler(a(document), "blur.jqxKnob" + c.host[0].id);
            c.removeHandler(a(document), "mouseup.jqxKnob" + c.host[0].id);
            c.removeHandler(c.host, "wheel");
            c.removeHandler(c.host, "mousedown");
            c.host.empty();
            c._initRenderer(c.host);
            var d = c.renderer;
            if (!d) {
                return
            }
            c._steps = [];
            for (var b = 0; b <= (c.max - c.min) / c.step; b++) {
                c._steps.push(c.min + c.step * b)
            }
            c._initValues();
            c._render()
        },
        _render: function() {
            var b = this;
            b._drawBackground();
            b._drawDial();
            b._drawMarks();
            b._drawLabels();
            b._drawSpinner();
            b._drawProgressBars();
            b._updateMarksColor();
            b._updateSpinnerMarksColor();
            b._drawPointers();
            b._attatchPointerEventHandlers()
        },
        _setValue: function(k, b) {
            var h = this;
            var c = h.value;
            if (isNaN(k)) {
                k = h.min
            }
            if (k > h.max) {
                k = h.max
            } else {
                if (k < h.min) {
                    k = h.min
                }
            }
            if (h.snapToStep) {
                var j = h._steps;
                for (var f = 0; f < j.length; f++) {
                    if (k < j[f]) {
                        if (f === 0) {
                            k = j[f]
                        } else {
                            if (j[f] - k < k - j[f - 1]) {
                                k = j[f]
                            } else {
                                k = j[f - 1]
                            }
                        }
                        break
                    }
                }
            }
            if (k == c) {
                return
            }
            if (a.isArray(h.value)) {
                if (h._pointerGrabbedIndex != -1) {
                    if (h._pointerGrabbedIndex == 1) {
                        var g = h.value[0];
                        h.value[h._pointerGrabbedIndex] = k
                    }
                    if (h._pointerGrabbedIndex == 0) {
                        var e = h.value[1];
                        h.value[h._pointerGrabbedIndex] = k
                    }
                    h.value[h._pointerGrabbedIndex] = k
                }
            } else {
                h.value = k
            }
            h._updateProgressBarColor();
            h._updateMarksColor();
            h._updateSpinnerMarksColor();
            var d = h.dragStartAngle + h._calculateAngleFromValue(k, h.dragStartAngle, h.dragEndAngle, h.min, h.max);
            h._rotateSpinnerMarks(d);
            h._movePointers();
            h._raiseEvent(1, {
                value: h.value,
                type: b
            })
        },
        _updateMarksColor: function() {
            var e = this;
            if (e.marks && (e.marks.colorProgress || e.marks.colorRemaining)) {
                var h = e.renderer;
                var d = [];
                a.each(e._marksList, function(i) {
                    if (e.endAngle - e.startAngle === 360) {
                        if (i == e.max) {
                            d.push(i);
                            return
                        }
                    }
                    d.push(i)
                });
                var c = e._getColor(e.marks.colorProgress);
                var g = e._getColor(e.marks.colorRemaining);
                var f = e.value.length ? e.value[0] : e.value;
                for (var b = 0; b < e._dialMarks.length; b++) {
                    if (d[b] > f) {
                        if (e.marks.type === "circle") {
                            h.attr(e._dialMarks[b], {
                                fill: g
                            })
                        } else {
                            h.attr(e._dialMarks[b], {
                                stroke: g
                            })
                        }
                    } else {
                        if (e.marks.type === "circle") {
                            h.attr(e._dialMarks[b], {
                                fill: c
                            })
                        } else {
                            h.attr(e._dialMarks[b], {
                                stroke: c
                            })
                        }
                    }
                    if (e.progressBar && e.marks.drawAboveProgressBar) {
                        e._dialMarks[b].parentNode.appendChild(e._dialMarks[b].parentNode.removeChild(e._dialMarks[b]))
                    }
                }
            }
        },
        _updateSpinnerMarksColor: function() {
            var e = this;
            if (!e.spinner) {
                return
            }
            if (!e.spinner.marks) {
                return
            }
            if (e.spinner.marks && (e.spinner.marks.colorProgress || e.spinner.marks.colorRemaining)) {
                var h = e.renderer;
                var d = [];
                a.each(e._spinnerMarksList, function(i) {
                    if (e.endAngle - e.startAngle === 360) {
                        if (i == e.max) {
                            return
                        }
                    }
                    d.push(i)
                });
                var c = e._getColor(e.spinner.marks.colorProgress);
                var g = e._getColor(e.spinner.marks.colorRemaining);
                var f = e.value.length ? e.value[0] : e.value;
                for (var b = 0; b < e._spinnerMarks.length; b++) {
                    if (d[b] > f) {
                        if (e.spinner.marks.type === "circle") {
                            h.attr(e._spinnerMarks[b], {
                                fill: g
                            })
                        } else {
                            h.attr(e._spinnerMarks[b], {
                                stroke: g
                            })
                        }
                    } else {
                        if (e.spinner.marks.type === "circle") {
                            h.attr(e._spinnerMarks[b], {
                                fill: c
                            })
                        } else {
                            h.attr(e._spinnerMarks[b], {
                                stroke: c
                            })
                        }
                    }
                }
            }
        },
        _updateProgressBarColor: function() {
            var b = this;
            if (b.progressBar) {
                b._drawProgressBars()
            }
        },
        _validateProperties: function() {
            var c = this;
            var b = function(e, d) {
                if (e && typeof (e) === "string") {
                    var f = e;
                    e = {
                        fill: f,
                        stroke: f
                    };
                    return e;
                    return
                }
                if (!e) {
                    e = {};
                    e.fill = d;
                    e.stroke = d
                }
                if (e && e.fill && !e.stroke) {
                    e.stroke = e.fill
                }
                if (e && !e.fill && e.stroke) {
                    e.fill = e.stroke
                }
                if (e && !e.fill) {
                    e.fill = d
                }
                if (e && !e.stroke) {
                    e.stroke = d
                }
                return e
            };
            if (c.dial) {
                c.dial.style = b(c.dial.style, "#dddddd")
            }
            if (c.style) {
                c.style = b(c.style, "#dddddd")
            }
            if (c.progressBar) {
                c.progressBar.style = b(c.progressBar.style, "transparent");
                c.progressBar.background = b(c.progressBar.background, "transparent")
            }
            if (c.spinner) {
                c.spinner.style = b(c.spinner.style, "transparent")
            }
            if (c.pointer) {
                c.pointer.style = b(c.pointer.style, "transparent")
            }
            if (c.startAngle >= c.endAngle) {
                throw new Error("jqxKnob: The end angle must be bigger than the start angle!")
            }
            if (c.startAngle < 0 || c.startAngle > 360) {
                throw new Error("jqxKnob: Start angle must be between 0 and 360")
            }
            if (c.endAngle > c.startAngle + 360) {
                throw new Error("jqxKnob: End angle must be between startAngle and startAngle + 360")
            }
            if (c.dial && c.dial.color && c.dial.color !== "transparent") {
                if (!c.dial.outerRadius || !c.dial.innerRadius) {
                    throw new Error("jqxKnob: Dial options innerRadius and outerRadius need to be specified")
                }
            }
            if (c._isArray(c.pointer) || c._isArray(c.value)) {
                if (!c._isArray(c.pointer)) {
                    throw new Error("jqxKnob: If the value is an array, the pointer must also be an array.")
                }
                if (!c._isArray(c.value)) {
                    throw new Error("jqxKnob: If the pointer is an array, the value must also be an array.")
                }
                if (c.pointer.length !== c.value.length) {
                    throw new Error("jqxKnob: The pointer and value array sizes must match.")
                }
                if (c.progressBar) {
                    if (!c._isArray(c.progressBar.style) || c.progressBar.style.length !== c.pointer.length) {
                        throw new Error("jqxKnob: progressBar color must be an array with the same number of elements as the pointer and value.")
                    }
                }
            }
            return true
        }
    })
})(jqxBaseFramework);
