(function(SVG) {
    "use strict";

    SVG.Divbox = function Divbox(width, height, string) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.fontSize = 16;
        this.padding = 10;

        this.create(string);
        SVG.Shape.call(this);
        this.editable({
            editText: true,
            resizeSW: true,
            resizeE: true,
            resizeS: true,
            resizeW: true,
            resizeN: true
        });
    };

    SVG.Divbox.prototype = Object.create(SVG.Shape.prototype);
    SVG.Divbox.prototype.constructor = SVG.Shape;

    SVG.Divbox.prototype.create = function(string) {
        this.node = SVG.element("foreignObject", {
            x: this.padding,
            y: this.padding,
            width: this.width,
            height: this.height,
            requiredExtensions: "http://www.w3.org/1999/xhtml"
        });
        // this.node.g = {};

        var body = SVG.element("body", {
            style: 'margin:0',
            xmlns: SVG.xhtml
        }, SVG.xhtml);

        body.innerHTML = '<div style="background-color:blue;width:250px;height:130px" id="background"><p style="margin:0">Hello <span style="color:white;font-size:1.5em">world</span>!</p></div>';
        this.node.appendChild(body);
    };

    SVG.Divbox.prototype.size = function(width, height) {
        this.width = width;
        this.height = height;

        this.node.attr({
            width: this.width,
            height: this.height
        });
    };

    SVG.Divbox.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;

        this.node.attr({
            x: x,
            y: y
        });
    };

    SVG.Divbox.prototype.place = function(left, top, right, bottom) {
        if(left) {
            this.node.setAttribute('width', this.width = this.width + this.x - left);
            this.node.setAttribute('x', this.x = left);
        }

        if(top) {
            this.node.setAttribute('height', this.height = this.height + this.y - top);
            this.node.setAttribute('y', this.y = top);
        }

        if(right) this.node.setAttribute('width', this.width = right - this.x);
        if(bottom) this.node.setAttribute('height', this.height = bottom - this.y);

        return this;
    };
})(MeezioSVG);
