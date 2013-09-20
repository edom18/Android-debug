(function (win, doc, exports) {

    'use strict';

    var isTouch = 'ontouchstart' in window,
        MOUSE_DOWN = isTouch ? 'touchstart' : 'mousedown',
        MOUSE_MOVE = isTouch ? 'touchmove'  : 'mousemove',
        MOUSE_UP   = isTouch ? 'touchend'   : 'mouseup';

    function _addListener(node, type, callback, context) {

        function _handler(e) {
            callback.apply(context, e);
        }

        if (node.addEventListener) {
            node.addEventListener(type, _handler, false);
        }
        else {
            node.attachEvent('on' + type, _handler);
        }
    }

    /**
     * DebugLogger class.
     * @class
     * @constructor
     */
    function DebugLogger() {
        this._init();
    }

    DebugLogger.type = {
        ERROR: 1
    };

    DebugLogger.prototype = {
        constructor: DebugLogger,

        /*! ------------------------------------------------------
            PRIVATE METHODS
        ---------------------------------------------------------- */
        _init: function () {
            this.el = doc.createElement('div');

            this.el.style.cssText = [
                'position: absolute;',
                'left: 0;',
                'top: 0;',
                'z-index: 1000;',
                'width: 100%;',
                'box-sizing: border-box;',
                'overflow: auto;',
                'color: white;',
                'line-height: 1.3;',
                'border: solid 1px #333;',
                'background: rgba(0, 0, 0, 0.7);',
                'padding: 5px;'
            ].join('');


            //Attach an event.
            _addListener(this.el, MOUSE_DOWN, this._mDown, this);
            _addListener(this.el, MOUSE_MOVE, this._mMove, this);
            _addListener(this.el, MOUSE_UP,   this._mUp,   this);

            //Append element to the body.
            document.body.appendChild(this.el);
        },

        _mDown: function (e) {
            this.flg = true;
        },
        _mMove: function (e) {
            this.flg = false;
        },
        _mUp: function (e) {
            if (this.flg === true) {
                this.el.parentNode.removeChild(this.el);
            }

            this.flg = false;
        },

        /**
         * @param {string} mes To show message.
         * @param {enum.<number>} type Log type.
         */
        _log: function (mes, type) {
            var exStyle = '';
            var logMessage = '';

            if (type === DebugLogger.type.ERROR) {
                exStyle = 'color: red;';
            }

            //Escape html strings.
            mes = mes.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            logMessage = '<p style="border-bottom: solid 1px #777; padding-bottom: 2px; margin-bottom: 2px; ' + exStyle + '">' + mes + '</p>';
            this.el.innerHTML =  logMessage + this.el.innerHTML;
        },

        _checkObj: function (obj) {

            var res = [],
                resobj = [];

            var type = {}.toString.call(obj);

            if (!(type === '[object Object]' || type === '[object Array]')) {
                return [obj];
            }

            for (var key in obj) {
                if (typeof obj[key] === 'object') {
                    resobj = _checkObj(obj[key]);
                    res.push(key + ': {' + resobj.join(', ') + '}');
                }
                else {
                    res.push(key + ': ' + obj[key]);
                }
            }

            return res;
        },

        _dump: function (obj) {
            var mes = this._checkObj(obj);
            return mes.join(', ');
        },

        /*! ------------------------------------------------------
            PUBLIC METHODS
        ---------------------------------------------------------- */
        log: function () {
            var mes = [];

            for (var i = 0, l = arguments.length; i < l; i++) {
                mes.push(this._dump(arguments[i]));
            }

            this._log(mes.join(''));
        },

        error: function () {
            var mes = [];

            for (var i = 0, l = arguments.length; i < l; i++) {
                mes.push(this._dump(arguments[i]));
            }

            this._log(mes.join(''), DebugLogger.type.ERROR);
        },

        clear: function () {
            this.el.innerHTML = '';
        }
    };

    /*! -------------------------------------------------------------
        EXPORTS
    ----------------------------------------------------------------- */
    exports.DebugLogger = DebugLogger;

}(window, document, window));
