(function(SVG) {
    "use strict";

    SVG.Meeziobox = function Meeziobox(width, height, string) {
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
            resizeN: true,
            maxBox: {
                x: 10,
                y: 20,
                w: 300,
                h: 270
            },
            minBox: {
                x: 100,
                y: 170,
                w: 50,
                h: 60
            }
        });
    };

    SVG.Meeziobox.prototype = Object.create(SVG.Shape.prototype);
    SVG.Meeziobox.prototype.constructor = SVG.Shape;

    SVG.Meeziobox.prototype.create = function(string) {
        this.node = SVG.element("g");
        this.node.g = {};

        this.node.g.frame = SVG.element("rect", {
            width: this.width,
            height: this.height,
            fill: '#00915A'
        });

        this.node.g.text = SVG.element("text", {
            x: this.padding,
            y: this.padding + this.fontSize,
            fill: "white",
            "font-size": this.fontSize,
            "font-weight": "bold"
        });
        this.node.g.text.innerHTML = string;

        this.node.appendChild(this.node.g.frame);
        this.node.appendChild(this.node.g.text);
    };

    SVG.Meeziobox.prototype.size = function(width, height) {
        this.width = width;
        this.height = height;

        this.node.g.frame.attr({
            width: this.width,
            height: this.height
        });
    };

    SVG.Meeziobox.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;

        this.node.g.frame.attr({
            x: x,
            y: y
        });

        this.node.g.text.attr({
            x: x + this.padding,
            y: y + this.padding + this.fontSize
        });
    };

    SVG.Meeziobox.prototype.place = function(left, top, right, bottom) {
        if(left) {
            this.node.g.frame.setAttribute('width', this.width = this.width + this.x - left);
            this.node.g.frame.setAttribute('x', this.x = left);
            this.node.g.text.setAttribute('x', this.x + this.padding);
        }

        if(top) {
            this.node.g.frame.setAttribute('height', this.height = this.height + this.y - top);
            this.node.g.frame.setAttribute('y', this.y = top);
            this.node.g.text.setAttribute('y', this.y + this.padding + this.fontSize);
        }

        if(right) this.node.g.frame.setAttribute('width', this.width = right - this.x);
        if(bottom) this.node.g.frame.setAttribute('height', this.height = bottom - this.y);

        return this;
    };
})(MeezioSVG);
