(function(SVG) {
    "use strict";

    SVG.Circle = function Circle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.create();
        SVG.Shape.call(this);
    };

    SVG.Circle.prototype = Object.create(SVG.Shape.prototype);
    SVG.Circle.prototype.constructor = SVG.Shape;

    SVG.Circle.prototype.create = function() {
        this.node = SVG.element("circle", {
            cx: this.x,
            cy: this.y,
            r: this.r,
            fill: 'red'
        });
    };

    SVG.Circle.prototype.size = function(rayon) {
        this.r = rayon;

        this.node.attr({
            r: this.r
        });

        return this;
    };

    SVG.Circle.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;

        this.node.attr({
            cx: this.x,
            cy: this.y
        });

        return this;
    };

    SVG.Shape.prototype.place = function(left, top, right, bottom) {
        if(left) {
            this.node.setAttribute('r', this.r = this.r + this.x - left);
            this.node.setAttribute('cx', this.x = left);
        }

        if(top) {
            this.node.setAttribute('r', this.r = this.r + this.y - top);
            this.node.setAttribute('cy', this.y = top);
        }

        if(right) this.node.setAttribute('r', this.r = right - this.x);
        if(bottom) this.node.setAttribute('r', this.r = bottom - this.y);

        return this;
    };
})(MeezioSVG);
