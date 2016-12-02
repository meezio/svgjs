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
     * The default options for editable SVG Shape. See {@link SVG.Shape#editable}
     *
     * @memberof SVG.options
     * @name SVG.options.editable
     * @property {string} SVG.options.editable.color="#00a8ff" Highlight color for a selected Shape.
     * @property {boolean} SVG.options.editable.rotate=true Whether the Shape can be rotated or not.
     * @property {boolean} SVG.options.editable.move=true Whether the Shape can be moved or not.
     * @property {boolean} SVG.options.editable.preserveAspectRatio=true Whether resizing from corners preserve aspect ratio or not.
     * @property {boolean} SVG.options.editable.resizeNW=true If the Shape can be resize in both north and west directions.
     * @property {boolean} SVG.options.editable.resizeNE=true If the Shape can be resize in both north and east directions.
     * @property {boolean} SVG.options.editable.resizeSE=true If the Shape can be resize in both south and east directions.
     * @property {boolean} SVG.options.editable.resizeSW=true If the Shape can be resize in both south and west directions.
     * @property {boolean} SVG.options.editable.resizeN=false If the Shape can be resize in north direction.
     * @property {boolean} SVG.options.editable.resizeE=false If the Shape can be resize in east direction.
     * @property {boolean} SVG.options.editable.resizeS=false If the Shape can be resize in south direction.
     * @property {boolean} SVG.options.editable.resizeW=false If the Shape can be resize in west direction.
     * @property {boolean} SVG.options.editable.editText=false Whether the text can be edited or not.
     * @property {object} SVG.options.editable.minBox Minimum boundary of the Shape.
     * @property {number} SVG.options.editable.minBox.x Abscissa of the minimum boudary.
     * @property {number} SVG.options.editable.minBox.y Ordinate of the minimum boudary.
     * @property {number} SVG.options.editable.minBox.w Width of the minimum boudary.
     * @property {number} SVG.options.editable.minBox.h Height of the minimum boudary.
     * @property {object} SVG.options.editable.maxBox Maximum boundary of the Shape.
     * @property {number} SVG.options.editable.maxBox.x Abscissa of the maximum boudary.
     * @property {number} SVG.options.editable.maxBox.y Ordinate of the maximum boudary.
     * @property {number} SVG.options.editable.maxBox.w Width of the maximum boudary.
     * @property {number} SVG.options.editable.maxBox.h Height of the maximum boudary.
     */
    SVG.options.editable = {
        color: "#00a8ff",
        rotate: true,
        move: true,
        preserveAspectRatio: true,
        resizeNW: true,
        resizeNE: true,
        resizeSE: true,
        resizeSW: true,
        resizeN: false,
        resizeE: false,
        resizeS: false,
        resizeW: false,
        editText: false
    };

    observer.on("selectSVGShape", function(shape) {
        removeSelection();
        if(shape.isEditable) drawSelection.call(shape);
    });

    observer.on("selectSVGDoc", function() {
        removeSelection();
    });

    /**
     * Makes the Shape editable and set custom options. Options can be changed further by calling this function again.
     *
     * @memberof SVG.Shape
     * @param {object} options={} Overwrite the default edit shape option. See {@link SVG.options.editable}.
     * @return {SVG.Shape} The shape instance.
     */
    SVG.Shape.prototype.editable = function(options) {
        options = options || {};

        this.isEditable = true;
        this.editableOptions = Object.assign({}, SVG.options.editable, options);

        return this;
    };

    /**
     * Remove the selection highlight from the Shape and unbind edit events.
     * @private
     */
    function removeSelection() {
        var node = document.querySelector(".SVGselection");

        if(node) node.parentNode.removeChild(node);
    }

    /**
     * Draw a selection highlight around the Shape and bind to edit events.
     * @private
     * @param {SVG.Shape} shape The SVG Shape on which to draw selection.
     * @return {object} The selection highlight object.
     */
    function drawSelection() {
        var box = this.node.getBBox();
        var svgDoc = this.node.closest("svg");
        var options = this.editableOptions;

        var selection = SVG.element("g", {
            class: "SVGselection",
            style: "shape-rendering:crispEdges;" // Désactive antialiasing
        });

        // Drawing & Events binding
        selection.appendChild(drawFrame.call(this, box, options));
        if(options.rotate) selection.appendChild(drawRotateHandle.call(this, box.x + box.width / 2, box.y, options));
        if(options.resizeNW) selection.appendChild(drawResizeHandle.call(this, box.x, box.y, "nwse-resize", options, 'topLeft'));
        if(options.resizeNE) selection.appendChild(drawResizeHandle.call(this, box.x + box.width, box.y, "nesw-resize", options, 'topRight'));
        if(options.resizeSW) selection.appendChild(drawResizeHandle.call(this, box.x, box.y + box.height, "nesw-resize", options, 'bottomLeft'));
        if(options.resizeSE) selection.appendChild(drawResizeHandle.call(this, box.x + box.width, box.y + box.height, "nwse-resize", options, 'bottomRight'));
        if(options.resizeN) selection.appendChild(drawResizeHandle.call(this, box.x + box.width / 2, box.y, "ns-resize", options, 'top'));
        if(options.resizeE) selection.appendChild(drawResizeHandle.call(this, box.x + box.width, box.y + box.height / 2, "ew-resize", options, 'right'));
        if(options.resizeS) selection.appendChild(drawResizeHandle.call(this, box.x + box.width / 2, box.y + box.height, "ns-resize", options, 'bottom'));
        if(options.resizeW) selection.appendChild(drawResizeHandle.call(this, box.x, box.y + box.height / 2, "ew-resize", options, 'left'));

        /**
         * Test if a resize action try to exceed right boundary.
         * @private
         * @param {object} dim The dimension of the Shape.
         * @param {object} maxBox The maximum boundary of the Shape.
         * @param {object} minBox The minimum boundary of the Shape.
         * @param {object} deltaX The ordinate offset.
         * @return {boolean} Whether the Shape exceed the right boundaries.
         */
        function isOutEastBoundary(dim, maxBox, minBox, deltaX) {
            var ret = false;

            if(maxBox && deltaX > 0)
                ret = dim.x + dim.width > maxBox.x + maxBox.w;
            else if(minBox && deltaX < 0)
                ret = dim.x + dim.width < minBox.x + minBox.w;
            return ret;
        }

        /**
         * Test if a resize action try to exceed left boundary.
         * @private
         * @param {object} dim The dimension of the Shape.
         * @param {object} maxBox The maximum boundary of the Shape.
         * @param {object} minBox The minimum boundary of the Shape.
         * @param {object} deltaX The ordinate offset.
         * @return {boolean} Whether the Shape exceed the left boundaries.
         */
        function isOutWestBoundary(dim, maxBox, minBox, deltaX) {
            var ret = false;

            if(maxBox && deltaX < 0)
                ret = dim.x < maxBox.x;
            else if(minBox && deltaX > 0)
                ret = dim.x > minBox.x;
            return ret;
        }

        /**
         * Test if a resize action try to exceed bottom boundary.
         * @private
         * @param {object} dim The dimension of the Shape.
         * @param {object} maxBox The maximum boundary of the Shape.
         * @param {object} minBox The minimum boundary of the Shape.
         * @param {object} deltaY The ordinate offset.
         * @return {boolean} Whether the Shape exceed the bottom boundaries.
         */
        function isOutSouthBoundary(dim, maxBox, minBox, deltaY) {
            var ret = false;

            if(maxBox && deltaY > 0)
                ret = dim.y + dim.height > maxBox.y + maxBox.h;
            else if(minBox && deltaY < 0)
                ret = dim.y + dim.height < minBox.y + minBox.h;
            return ret;
        }

        /**
         * Test if a resize action try to exceed top boundary.
         * @private
         * @param {object} dim The dimension of the Shape.
         * @param {object} maxBox The maximum boundary of the Shape.
         * @param {object} minBox The minimum boundary of the Shape.
         * @param {object} deltaY The ordinate offset.
         * @return {boolean} Whether the Shape exceed the top boundaries.
         */
        function isOutNorthBoundary(dim, maxBox, minBox, deltaY) {
            var ret = false;

            if(maxBox && deltaY < 0)
                ret = dim.y < maxBox.y;
            else if(minBox && deltaY > 0)
                ret = dim.y > minBox.y;
            return ret;
        }

        selection.moveDown = function(deltaY, options) {
            var frame = this.firstChild;
            var dim = frame.getBBox();
            var notOutSouth = !isOutSouthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if(dim.height + deltaY > 0 && deltaY !== 0 && notOutSouth) {
                frame.setAttribute('height', dim.height + deltaY);
                this.translateNode(".bottomLeft", 0, deltaY);
                this.translateNode(".bottom", 0, deltaY);
                this.translateNode(".bottomRight", 0, deltaY);
                this.translateNode(".left", 0, deltaY / 2);
                this.translateNode(".right", 0, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveRight = function(deltaX, options) {
            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var notOutEast = !isOutEastBoundary(dim, options.maxBox, options.minBox, deltaX);

            if(dim.width + deltaX > 0 && deltaX !== 0 && notOutEast) {
                frame.setAttribute('width', dim.width + deltaX);
                this.translateNode(".topRight", deltaX, 0);
                this.translateNode(".right", deltaX, 0);
                this.translateNode(".bottomRight", deltaX, 0);
                this.translateNode(".rotate", deltaX / 2, 0);
                this.translateNode(".top", deltaX / 2, 0);
                this.translateNode(".bottom", deltaX / 2, 0);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveUp = function(deltaY, options) {
            var frame = this.firstChild;
            var dim = frame.getBBox();
            var notOutNorth = !isOutNorthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if(dim.height - deltaY > 0 && deltaY !== 0 && notOutNorth) {
                frame.setAttribute('y', dim.y + deltaY);
                frame.setAttribute('height', dim.height - deltaY);
                this.translateNode(".topLeft", 0, deltaY);
                this.translateNode(".top", 0, deltaY);
                this.translateNode(".topRight", 0, deltaY);
                this.translateNode(".rotate", 0, deltaY);
                this.translateNode(".left", 0, deltaY / 2);
                this.translateNode(".right", 0, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveLeft = function(deltaX, options) {
            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var notOutWest = !isOutWestBoundary(dim, options.maxBox, options.minBox, deltaX);

            if(dim.width - deltaX > 0 && deltaX !== 0 && notOutWest) {
                frame.setAttribute('x', dim.x + deltaX);
                frame.setAttribute('width', dim.width - deltaX);
                this.translateNode(".topLeft", deltaX, 0);
                this.translateNode(".left", deltaX, 0);
                this.translateNode(".bottomLeft", deltaX, 0);
                this.translateNode(".rotate", deltaX / 2, 0);
                this.translateNode(".top", deltaX / 2, 0);
                this.translateNode(".bottom", deltaX / 2, 0);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveUpLeft = function(deltaX, deltaY, options) {
            if(options.preserveAspectRatio)
                deltaX = deltaY;

            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var outWest = isOutWestBoundary(dim, options.maxBox, options.minBox, deltaX);
            var outNorth = isOutNorthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if((deltaY !== 0 && dim.height - deltaY > 0 && !outNorth) && (deltaX === 0 || dim.width - deltaX <= 0 || outWest))
                return this.moveUp(deltaY, options);
            else if((deltaX !== 0 && dim.width - deltaX > 0 && !outWest) && (deltaY === 0 || dim.height - deltaY <= 0 || outNorth))
                return this.moveLeft(deltaX, options);
            else if(dim.width - deltaX > 0 && dim.height - deltaY > 0 && deltaX !== 0 && deltaY !== 0 && !outWest && !outNorth) {
                frame.setAttribute('y', dim.y + deltaY);
                frame.setAttribute('height', dim.height - deltaY);
                frame.setAttribute('x', dim.x + deltaX);
                frame.setAttribute('width', dim.width - deltaX);
                this.translateNode(".topLeft", deltaX, deltaY);
                this.translateNode(".left", deltaX, deltaY / 2);
                this.translateNode(".bottomLeft", deltaX, 0);
                this.translateNode(".rotate", deltaX / 2, deltaY);
                this.translateNode(".top", deltaX / 2, deltaY);
                this.translateNode(".bottom", deltaX / 2, 0);
                this.translateNode(".topRight", 0, deltaY);
                this.translateNode(".right", 0, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveDownRight = function(deltaX, deltaY, options) {
            if(options.preserveAspectRatio)
                deltaX = deltaY;

            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var outEast = isOutEastBoundary(dim, options.maxBox, options.minBox, deltaX);
            var outSouth = isOutSouthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if((deltaY !== 0 && dim.height + deltaY > 0 && !outSouth) && (deltaX === 0 || dim.width + deltaX <= 0 || outEast))
                return this.moveDown(deltaY, options);
            else if((deltaX !== 0 && dim.width + deltaX > 0 && !outEast) && (deltaY === 0 || dim.height + deltaY <= 0 || outSouth))
                return this.moveRight(deltaX, options);
            else if(dim.width + deltaX > 0 && dim.height + deltaY > 0 && deltaX !== 0 && deltaY !== 0 && !outEast && !outSouth) {
                frame.setAttribute('height', dim.height + deltaY);
                frame.setAttribute('width', dim.width + deltaX);
                this.translateNode(".bottomLeft", 0, deltaY);
                this.translateNode(".bottomRight", deltaX, deltaY);
                this.translateNode(".topRight", deltaX, 0);
                this.translateNode(".rotate", deltaX / 2, 0);
                this.translateNode(".top", deltaX / 2, 0);
                this.translateNode(".bottom", deltaX / 2, deltaY);
                this.translateNode(".left", 0, deltaY / 2);
                this.translateNode(".right", deltaX, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveDownLeft = function(deltaX, deltaY, options) {
            if(options.preserveAspectRatio)
                deltaX = -deltaY;

            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var outWest = isOutWestBoundary(dim, options.maxBox, options.minBox, deltaX);
            var outSouth = isOutSouthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if((deltaY !== 0 && dim.height + deltaY > 0 && !outSouth) && (deltaX === 0 || dim.width - deltaX <= 0 || outWest))
                return this.moveDown(deltaY, options);
            else if((deltaX !== 0 && dim.width - deltaX > 0 && !outWest) && (deltaY === 0 || dim.height + deltaY <= 0 || outSouth))
                return this.moveLeft(deltaX, options);
            else if(dim.width - deltaX > 0 && dim.height + deltaY > 0 && deltaX !== 0 && deltaY !== 0 && !outWest && !outSouth) {
                frame.setAttribute('x', dim.x + deltaX);
                frame.setAttribute('width', dim.width - deltaX);
                frame.setAttribute('height', dim.height + deltaY);
                this.translateNode(".topLeft", deltaX, 0);
                this.translateNode(".left", deltaX, deltaY / 2);
                this.translateNode(".bottomLeft", deltaX, deltaY);
                this.translateNode(".rotate", deltaX / 2, 0);
                this.translateNode(".top", deltaX / 2, 0);
                this.translateNode(".bottom", deltaX / 2, deltaY);
                this.translateNode(".bottomRight", 0, deltaY);
                this.translateNode(".right", 0, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.moveUpRight = function(deltaX, deltaY, options) {
            if(options.preserveAspectRatio)
                deltaX = -deltaY;

            var frame = selection.firstChild;
            var dim = frame.getBBox();
            var outEast = isOutEastBoundary(dim, options.maxBox, options.minBox, deltaX);
            var outNorth = isOutNorthBoundary(dim, options.maxBox, options.minBox, deltaY);

            if((deltaY !== 0 && dim.height - deltaY > 0 && !outNorth) && (deltaX === 0 || dim.width + deltaX <= 0 || outEast))
                return this.moveUp(deltaY, options);
            else if((deltaX !== 0 && dim.width + deltaX > 0 && !outEast) && (deltaY === 0 || dim.height - deltaY <= 0 || outNorth))
                return this.moveRight(deltaX, options);
            else if(dim.width + deltaX > 0 && dim.height - deltaY > 0 && deltaX !== 0 && deltaY !== 0 && !outEast && !outNorth) {
                frame.setAttribute('y', dim.y + deltaY);
                frame.setAttribute('height', dim.height - deltaY);
                frame.setAttribute('width', dim.width + deltaX);
                this.translateNode(".topRight", deltaX, deltaY);
                this.translateNode(".right", deltaX, deltaY / 2);
                this.translateNode(".bottomRight", deltaX, 0);
                this.translateNode(".rotate", deltaX / 2, deltaY);
                this.translateNode(".top", deltaX / 2, deltaY);
                this.translateNode(".bottom", deltaX / 2, 0);
                this.translateNode(".topLeft", 0, deltaY);
                this.translateNode(".left", 0, deltaY / 2);
                return frame.getBBox();
            }
            return null;
        };

        selection.move = function(deltaX, deltaY, options) {
            var frame = selection.firstChild;
            var dim = frame.getBBox();

            frame.setAttribute('y', dim.y + deltaY);
            frame.setAttribute('x', dim.x + deltaX);
            this.translateNode(".topRight", deltaX, deltaY);
            this.translateNode(".right", deltaX, deltaY);
            this.translateNode(".bottomRight", deltaX, deltaY);
            this.translateNode(".bottomLeft", deltaX, deltaY);
            this.translateNode(".rotate", deltaX, deltaY);
            this.translateNode(".top", deltaX, deltaY);
            this.translateNode(".bottom", deltaX, deltaY);
            this.translateNode(".topLeft", deltaX, deltaY);
            this.translateNode(".left", deltaX, deltaY);
            return frame.getBBox();
        };

        selection.translateNode = function(name, x, y) {
            var node = this.querySelector(name);
            if(node) node.translate(x, y);
        };

        return svgDoc.insertBefore(selection, svgDoc.lastChild.nextSibling);
    }

    /**
     * Draw a SVG selection frame.
     * @private
     * @param {object} box Location and size of the selection. See [SVGRect]{@link https://www.w3.org/TR/SVG/types.html#InterfaceSVGRect}
     * @param {object} options The editable options for the Shape.
     * @return {object} The SVG selection frame.
     */
    function drawFrame(box, options) {
        var _this = this;
        // Position de la souris lors du mousedown/touchstart sur d'un handle. Nécessaire pour calculer l'offset (FF < v39)
        var initPositionX = 0;
        var initPositionY = 0;

        var frame = SVG.element("rect", {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            fill: 'none',
            stroke: options.color,
            'stroke-width': "1px",
            'stroke-dasharray': "3 2",
            'pointer-events': "fill"
        });

        if(options.move) {
            frame.attr({style: "cursor: move;"});

            // Bind/unbind event on handle and trigger moveSVGShape to observer
            frame.onmousedown = function(ev) {
                initPositionX = ev.clientX;
                initPositionY = ev.clientY;
                disableSelection();
                window.addEventListener("mousemove", onmove);
                window.addEventListener("mouseup", function() {
                    window.removeEventListener("mousemove", onmove);
                    enableSelection();
                });
            };

            frame.ontouchstart = function(ev) {
                disableSelection();
                window.addEventListener("touchmove", onmove);
                window.addEventListener("touchend", function() {
                    window.removeEventListener("touchmove", onmove);
                    enableSelection();
                });
            };
        }

        if(options.editText) frame.ondblclick = function(ev) {
            console.log("Edition du texte");
            ev.stopPropagation();
        };

        frame.onclick = function(ev) {
            ev.stopPropagation();
        };

        /**
         * Function call when mouse move or touch move for moving a shape. It trigger a moveSVGShape event.
         * @private
         * @param {event} ev The move event (mouse or touch).
         */
        function onmove(ev) {
            /**
             * This event is fire when a SVG Shape is moving.
             *
             * @event SVG.Shape#moveSVGShape
             * @param {SVG.Shape} shape The moved Shape.
             * @param {object} selection The selection SVG groupe node.
             * @param {number} deltaX The abscissa displacement offset.
             * @param {number} deltaY The ordinate displacement offset.
             */
            observer.trigger("moveSVGShape", _this, frame.parentNode, ev.clientX - initPositionX, ev.clientY - initPositionY);
            initPositionY = ev.clientY;
            initPositionX = ev.clientX;
        }

        return frame;
    }

    /**
     * Draw a SVG resize handle.
     * @private
     * @param {number} x The abscissa of the handle.
     * @param {number} y The ordinate of the handle.
     * @param {string} cursor CSS cursor style.
     * @param {object} options The editable options for the Shape.
     * @param {string} type Type of resize (top, bottom, leftTop,...).
     * @return {object} The SVG resize handle.
     */
    function drawResizeHandle(x, y, cursor, options, type) {
        var _this = this;
        // Position de la souris lors du mousedown/touchstart sur d'un handle. Nécessaire pour calculer l'offset (FF < v39)
        var initPositionX = 0;
        var initPositionY = 0;

        var point = SVG.element("g", {
            style: "shape-rendering:auto;cursor: " + cursor + ";",
            class: type,
            transform: "translate(0, 0)"
        });

        point.translate = function(deltaX, deltaY) {
            var trans = point.transform.baseVal.getItem(0);
            trans.setTranslate(trans.matrix.e + deltaX, trans.matrix.f + deltaY);
        };

        var background = SVG.element("circle", {
            cx: x,
            cy: y,
            r: 6,
            fill: 'white',
            stroke: options.color,
            "stroke-width": "1px",
            "stroke-opacity": 0.5
        });

        var forground = SVG.element("circle", {
            cx: x,
            cy: y,
            r: 4,
            fill: options.color
        });

        point.appendChild(background);
        point.appendChild(forground);

        // Bind/unbind event on handle and trigger resizeSVGShape to observer
        point.onmousedown = function(ev) {
            initPositionX = ev.clientX;
            initPositionY = ev.clientY;
            disableSelection();
            window.addEventListener("mousemove", onresize);
            window.addEventListener("mouseup", function() {
                window.removeEventListener("mousemove", onresize);
                enableSelection();
            });
        };

        point.ontouchstart = function(ev) {
            disableSelection();
            window.addEventListener("touchmove", onresize);
            window.addEventListener("touchend", function() {
                window.removeEventListener("touchmove", onresize);
                enableSelection();
            });
        };

        /**
         * Function call when mouse move or touch move for resizing a shape. It trigger a resizeSVGShape event.
         * @private
         * @param {event} ev The move event (mouse or touch).
         */
        function onresize(ev) {
            /**
             * This event is fire when a SVG Shape is resizing.
             * @example observer.on("resizeSVGShape", function(shape, selection, type, deltaX, deltaY) {
             *     ...
             * });
             *
             * @event SVG.Shape#resizeSVGShape
             * @param {SVG.Shape} shape The Shape resized.
             * @param {object} selection The selection SVG groupe node.
             * @param {string} type The type of resizing. Can be 'top', 'bottom', 'left', 'right', 'topLeft', 'topRight', 'bottomLeft' or 'bottomRight'.
             * @param {number} deltaX The abscissa displacement offset.
             * @param {number} deltaY The ordinate displacement offset.
             */
            observer.trigger("resizeSVGShape", _this, point.parentNode, type, ev.clientX - initPositionX, ev.clientY - initPositionY);
            initPositionY = ev.clientY;
            initPositionX = ev.clientX;
        }

        return point;
    }

    /**
     * Draw a SVG rotate handle.
     * @private
     * @param {number} x The abscissa of the handle.
     * @param {number} y The ordinate of the handle.
     * @param {object} options The editable options for the Shape.
     * @return {object} The SVG rotage handle.
     */
    function drawRotateHandle(x, y, options) {
        var _this = this;
        // Position de la souris lors du mousedown/touchstart sur d'un handle. Nécessaire pour calculer l'offset (FF < v39)
        var initPositionX = 0;
        var initPositionY = 0;

        var point = SVG.element("g", {
            style: "shape-rendering:auto;cursor: crosshair;",
            class: "rotate",
            transform: "translate(0, 0)"
        });

        var background = SVG.element("circle", {
            cx: x,
            cy: y - 19,
            r: 8,
            fill: 'transparent'
        });

        var arrow = SVG.element("path", {
            transform: "translate(" + (x - 8) + ", " + (y - 30) + ")",
            d: "M 11.607273,4.567559 7.04,0 V 3.08383 C 3.0545455,3.578406 0,6.953164 0,11.055239 c 0,4.102076 3.0545455,7.476833 7.04,7.97141 V 16.990157 C 4.1890909,16.524674 2.0072728,14.022698 2.0072728,11.055239 2.0072728,8.08778 4.1890909,5.585805 7.04,5.120321 v 3.92752 L 11.607273,4.567559 z M 16,10.036994 C 15.825454,8.640542 15.272727,7.302276 14.370909,6.138567 l -1.425455,1.425544 c 0.523637,0.756411 0.872728,1.6001 1.018182,2.472883 H 16 z m -6.9527273,6.953163 v 2.036492 C 10.443636,18.852093 11.810909,18.299331 12.974545,17.397456 L 11.52,15.942819 c -0.756364,0.552762 -1.6,0.901875 -2.4727273,1.047338 z m 3.8981813,-2.443789 1.425455,1.425544 C 15.272727,14.808202 15.825454,13.469936 16,12.073485 h -2.036364 c -0.145454,0.872782 -0.465454,1.716471 -1.018182,2.472883 z",
            fill: options.color
        });

        point.translate = function(deltaX, deltaY) {
            var trans = point.transform.baseVal.getItem(0);
            trans.setTranslate(trans.matrix.e + deltaX, trans.matrix.f + deltaY);
        };

        point.appendChild(background);
        point.appendChild(arrow);

        // Bind/unbind event on handle and trigger resizeSVGShape to observer
        point.onmousedown = function(ev) {
            initPositionX = ev.clientX;
            initPositionY = ev.clientY;
            disableSelection();
            window.addEventListener("mousemove", onrotate);
            window.addEventListener("mouseup", function() {
                window.removeEventListener("mousemove", onrotate);
                enableSelection();
            });
        };

        point.ontouchstart = function(ev) {
            disableSelection();
            window.addEventListener("touchmove", onrotate);
            window.addEventListener("touchend", function() {
                window.removeEventListener("touchmove", onrotate);
                enableSelection();
            });
        };

        /**
         * Function call when mouse move or touch move to rotate a shape. It trigger a rotateSVGShape event.
         * @private
         * @param {event} ev The move event (mouse or touch).
         */
        function onrotate(ev) {
            /**
             * This event is fire when a SVG Shape is rotate.
             *
             * @event SVG.Shape#rotateSVGShape
             * @param {SVG.Shape} shape The rotated Shape.
             * @param {object} selection The selection SVG groupe node.
             * @param {number} deltaX The abscissa displacement offset.
             * @param {number} deltaY The ordinate displacement offset.
             */
            observer.trigger("rotateSVGShape", _this, point.parentNode, ev.clientX - initPositionX, ev.clientY - initPositionY);
            initPositionY = ev.clientY;
            initPositionX = ev.clientX;
        }

        return point;
    }

    /**
     * Disable selection inside the HTML document.
     * @private
     */
    function disableSelection() {
        var html = document.querySelector("html");

        html.setAttribute('unselectable', 'on');
        html.setAttribute('style', 'user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select: none;');
    }

    /**
     * Enable selection inside the HTML document.
     * @private
     */
    function enableSelection() {
        var html = document.querySelector("html");

        html.removeAttribute('unselectable');
        html.removeAttribute('style');
    }
})(MeezioSVG);
