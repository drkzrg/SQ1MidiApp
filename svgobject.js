(function() {

    var SVGObject = function(type, attrs, container) {

        this.ns = "http://www.w3.org/2000/svg";
        this.o = document.createElementNS(this.ns, type);

        if (typeof(attrs) == 'object') {
            for (var key in attrs) {
                this.o.setAttributeNS(null, key, attrs[key]);
            }
        }

        try{
            if (typeof(container) != 'undefined')
                this.append(container);
        } catch(e) {
            console.log('une erreur a lieu', e);
        }

    }

    SVGObject.prototype = {

        append: function(container) {
            try{
                var c = document.querySelector(container);
                c.appendChild(this.o);
            } catch(e){
                console.log('WARNING: c vaut', c);
                console.log('Erreur avec le selecteur : ', container);
                console.log(e);
            }
        },

        rotate: function (degree, x, y){

            this.o.setAttributeNS(null, 'transform', 'rotate('+degree+' '+x+' '+y+' )');
        }
    }
    window.SVGObject = SVGObject;

}());
