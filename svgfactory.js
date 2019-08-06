(function() {

    var SVGObject = function(type, attrs, container) {

        this.ns = "http://www.w3.org/2000/svg";
        this.o = document.createElementNS(this.ns, type);

        if (typeof(attrs) == 'object') {
            for (var key in attrs) {
                this.o.setAttributeNS(null, key, attrs[key]);
            }
        }

        if (typeof(container) != 'undefined')
            this.append(container);

    }

    SVGObject.prototype = {

        append: function(container) {
            var c = document.querySelector(container);
            c.appendChild(this.o);
        }
    }



    window.SVGObject = SVGObject;

}());
