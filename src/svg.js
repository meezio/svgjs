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

/** @namespace SVG */
(function(global) {
    "use strict";

    var SVG = {};

    /**
     * @memberof SVG
     * @namespace
     */
    SVG.options = {};

    /**
     * SVG Namespace
     * @memberof SVG
     * @constant
     * @default
     */
    SVG.ns = 'http://www.w3.org/2000/svg';

    /**
     * XLink namespace
     * @memberof SVG
     * @constant
     * @default
     */
    SVG.xlink = 'http://www.w3.org/1999/xlink';

    /**
     * XHTML namespace
     * @memberof SVG
     * @constant
     * @default
     */
    SVG.xhtml = 'http://www.w3.org/1999/xhtml';

    // Element id sequence
    var did = 1000;

    // Get next named element id
    var eid = function() {
        return 'svg' + (did++);
    };

    /**
     * Creates a new SVG element.
     *
     * @memberof SVG
     * @param {string} name Name of the SVG element to create.
     * @param {object} [attrs={}] SVG attribute for the element.
     * @param {string} [namespace='http://www.w3.org/2000/svg'] Element namespace.
     * @return {object} The SVG element created.
     */
    SVG.element = function(name, attrs, namespace) {
        namespace = namespace || SVG.ns;
        var node = document.createElementNS(namespace, name);

        attrs = attrs || {};

        node.setAttribute('id', eid());

        node.attr = function(attributes) {
            for(var attribute in attributes) {
                node.setAttribute(attribute, attributes[attribute]);
            }
        };

        node.attr(attrs);

        return node;
    };

    /**
     * Creates an instance of SVG Shape.
     *
     * @class
     * @memberof SVG
     * @property {boolean} isEditable Whether the shape editable or not.
     */
    SVG.Shape = function Shape() {
        var _this = this;

        this.isEditable = false;

        this.node.onclick = function(ev) {
            /**
             * This event is fire when a SVG Shape is selected by a mouse click.
             *
             * @event SVG.Shape#selectSVGShape
             * @param {SVG.Shape} shape The selected SVG Shape.
             */
            observer.trigger("selectSVGShape", _this);
            ev.stopPropagation();
        };
    };

    /**
     * Change the size of a shape.
     *
     * @memberof SVG.Shape
     * @param {number} width The width of the Shape.
     * @param {number} height The height of the Shape.
     * @return {SVG.Shape} The shape instance.
     */
    SVG.Shape.prototype.size = function(width, height) {
        this.width = width;
        this.height = height;

        this.node.attr({
            width: this.width,
            height: this.height
        });

        return this;
    };

    /**
     * Move a shape.
     *
     * @memberof SVG.Shape
     * @param {number} x The abscissa of the Shape.
     * @param {number} y The ordinate of the Shape.
     * @return {SVG.Shape} The shape instance.
     */
    SVG.Shape.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;

        this.node.attr({
            x: this.x,
            y: this.y
        });

        return this;
    };

    /**
     * Creates an instance of SVG Document (a &lt;svg&gt; tag) and add it to another element.
     * @example <div id="container"></div>
     * <script>var doc = new SVG.Document("container")</script>
     *
     * @class
     * @memberof SVG
     * @param {string} element Id attribute of the element which will contain the SVG Document.
     * @param {string} svgid Id attribute of the SVG element created.
     * @property {number} width=100% The width of the SVG Document.
     * @property {number} height=100% The height of the SVG Document.
     * @property {number} x=0 The abscissa of the SVG Document.
     * @property {number} y=0 The ordinate of the SVG Document.
     */
    SVG.Document = function Document(element, svgid) {
        var _this = this;

        this.width = "100%";
        this.height = "100%";
        this.x = 0;
        this.y = 0;
        this.create(element, svgid);

        this.node.onclick = function(ev) {
            /**
             * This event is fire when a SVG Document is selected by a mouse click.
             * @example observer.on("selectSVGDoc", function(doc) {
             *     ...
             * });
             *
             * @event SVG.Document#selectSVGDoc
             * @param {SVG.Document} doc The selected SVG Document.
             */
            observer.trigger("selectSVGDoc", _this);
            ev.stopPropagation();
        };
    };

    SVG.Document.prototype.create = function(element, svgid) {
        this.node = SVG.element("svg", {
            width: this.width,
            height: this.height,
            version: "1.1",
            xmlns: SVG.ns,
            'xmlns:xlink': SVG.xlink
        });

        if(svgid)
            this.node.setAttribute('id', svgid);

        var container = document.getElementById(element);
        container.innerHTML = '';
        container.appendChild(this.node);
    };

    /**
     * Add a SVG Shape to the SVG Document.
     *
     * @memberof SVG.Document
     * @param {SVG.Shape} shape An instance of Shape to add to the SVG Document.
     */
    SVG.Document.prototype.add = function(shape) {
        this.node.appendChild(shape.node);
    };

    /**
     * Change the size of a SVG Document.
     *
     * @memberof SVG.Document
     * @param {number} width The width of the Document.
     * @param {number} height The height of the Document.
     * @return {SVG.Document} The Document instance.
     */
    SVG.Document.prototype.size = function(width, height) {
        this.width = width;
        this.height = height;

        this.node.attr({
            width: this.width,
            height: this.height
        });

        observer.trigger("docsized", this);
        return this;
    };

    global.MeezioSVG = SVG;
})(this);
