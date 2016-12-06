/**
* MIT License
*
* Copyright (c) 2016 Meezio SAS <dev@meez.io>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

(function(SVG) {
    "use strict";

    /**
     * Move and/or resize a Shape by updating its edges coordinates. If an edge coordonate is set to null, its position won't be updated.
     *
     * @memberof SVG.Shape
     * @param {number} left The abscissa of the left egde.
     * @param {number} top The ordinate of the top edge.
     * @param {number} right The abscissa of the right edge.
     * @param {number} bottom The ordinate of the bottom edge.
     * @return {SVG.Shape} The shape instance.
     */
    SVG.Shape.prototype.place = function(left, top, right, bottom) {
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

    observer.on("rotateSVGShape", function(shape, selection, deltaX, deltaY, scale) {
        // TODO implement rotation selection and shape (with transform but see how to compute degres)
        console.log(shape, selection, deltaX, deltaY);
        console.log(shape.editableOptions);
    });

    observer.on("moveSVGShape", function(shape, selection, deltaX, deltaY, scale) {
        var newBox = selection.move(deltaX, deltaY);
        // TODO ajouter les contraintes de box (options) pour limiter le déplacement
        shape.move(newBox.x / scale, newBox.y / scale);
    });

    observer.on("resizeSVGShape", function(shape, selection, type, deltaX, deltaY, scale) {
        var newBox = null;
        var opt = shape.editableOptions;
        var shapeBox = shape.node.getBBox();
        var aspectRatio = shapeBox.width / shapeBox.height;

        switch(type) {
        case "top":
            if((newBox = selection.moveUp(deltaY, opt, scale))) {
                shape.place(0, newBox.y / scale, 0, 0);
            }
            break;
        case "bottom":
            if((newBox = selection.moveDown(deltaY, opt, scale))) {
                shape.place(0, 0, 0, (newBox.y + newBox.height) / scale);
            }
            break;
        case "left":
            if((newBox = selection.moveLeft(deltaX, opt, scale))) {
                shape.place(newBox.x / scale, 0, 0, 0);
            }
            break;
        case "right":
            if((newBox = selection.moveRight(deltaX, opt, scale))) {
                shape.place(0, 0, (newBox.x + newBox.width) / scale, 0);
            }
            break;
        case "topLeft":
            if((newBox = selection.moveUpLeft(deltaX, deltaY, opt, aspectRatio, scale))) {
                shape.place(newBox.x / scale, newBox.y / scale, 0, 0);
            }
            break;
        case "topRight":
            if((newBox = selection.moveUpRight(deltaX, deltaY, opt, aspectRatio, scale))) {
                shape.place(0, newBox.y / scale, (newBox.x + newBox.width) / scale, 0);
            }
            break;
        case "bottomLeft":
            if((newBox = selection.moveDownLeft(deltaX, deltaY, opt, aspectRatio, scale))) {
                shape.place(newBox.x / scale, 0, 0, (newBox.y + newBox.height) / scale);
            }
            break;
        case "bottomRight":
            if((newBox = selection.moveDownRight(deltaX, deltaY, opt, aspectRatio, scale))) {
                shape.place(0, 0, (newBox.x + newBox.width) / scale, (newBox.y + newBox.height) / scale);
            }
            break;
        default:
            console.log("Unknow resize type " + type);
        }
    });
})(MeezioSVG);
