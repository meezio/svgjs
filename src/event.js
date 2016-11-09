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

/** @namespace observer */
(function(global) {
    "use strict";

    var observer = {
        ev: {},

        /**
         * Attach a callback function to an event.
         *
         * @memberof observer
         * @param {string} eventName A custom event name.
         * @param {function} fn The function to execute when the event is triggered.
         */
        on: function(eventName, fn) {
            if(typeof fn === "function") {
                (this.ev[eventName] = this.ev[eventName] || []).push(fn);
            }
        },

        /**
         * Attach a callback function to an event. The callback is executed at most once.
         *
         * @memberof observer
         * @param {string} eventName A custom event name.
         * @param {function} fn The function to execute when the event is triggered.
         */
        one: function(eventName, fn) {
            if(fn) {
                fn.once = true;
            }

            this.on(eventName, fn);
        },

        /**
         * Remove a callback function from an event.
         *
         * @memberof observer
         * @param {string} eventName The custom event name.
         * @param {function} fn The callback function previously attached to the event.
         */
        off: function(eventName, fn) {
            if(eventName === "*") {
                this.ev = {};
            }
            else if(this.ev[eventName]) {
                if(fn) {
                    for(var i = 0; i < this.ev[eventName].length; i++) {
                        if(this.ev[eventName][i] === fn) {
                            this.ev[eventName].splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    this.ev[eventName] = [];
                }
            }
        },

        /**
         * Execute all callbacks attached to an event.
         *
         * @memberof observer
         * @param {string} eventName The custom event name.
         */
        trigger: function(eventName) {
            var opts = [].slice.call(arguments, 1);
            var fns = this.ev[eventName] || [];

            for(var i = 0; i < fns.length; i++) {
                if(!fns[i].busy) {
                    fns[i].busy = true;
                    fns[i].apply(this.ev[eventName], opts);
                    if(fns[i].once) {
                        fns.splice(i, 1);
                        i--;
                    }
                    else {
                        fns[i].busy = false;
                    }
                }
            }
        }
    };

    global.observer = observer;
})(this);
