(function (win, doc, exports) {

    'use strict';

    var debugLogEl = doc.createElement('div'),
        style = debugLogEl.style;

    var isTouch = 'ontouchstart' in window,
        MOUSE_DOWN = isTouch ? 'touchstart' : 'mousedown',
        MOUSE_MOVE = isTouch ? 'touchmove'  : 'mousemove',
        MOUSE_UP   = isTouch ? 'touchend'   : 'mouseup';

    style.cssText = [
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

    function addListener(node, type, cb) {
        if (node.addEventListener) {
            node.addEventListener(type, cb, false);
        }
        else {
            node.attachEvent('on' + type, cb);
        }
    }

    var flg = false;
    addListener(debugLogEl, MOUSE_DOWN, function (e) {
        flg = true;
    });
    addListener(debugLogEl, MOUSE_MOVE, function (e) {
        flg = false;
    });
    addListener(debugLogEl, MOUSE_UP, function (e) {
        if (flg === true) {
            debugLogEl.parentNode.removeChild(debugLogEl);
        }
    });

    //Attach an event.
    doc.body.appendChild(debugLogEl);

    function _log(mes, type) {
        var exStyle = '';
        var logMessage = '';

        if (type === 'error') {
            exStyle = 'color: red;';
        }

        //Escape html strings.
        mes = mes.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        logMessage = '<p style="border-bottom: solid 1px #777; padding-bottom: 2px; margin-bottom: 2px; ' + exStyle + '">' + mes + '</p>';
        debugLogEl.innerHTML =  logMessage + debugLogEl.innerHTML;
    }

    function _checkObj(obj) {
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
    }

    function _dump(obj) {
        var mes = _checkObj(obj);
        return mes.join(', ');
    }

    function log() {
        var mes = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            mes.push(_dump(arguments[i]));
        }
        _log(mes.join(''));
    }

    function error() {
        var mes = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            mes.push(_dump(arguments[i]));
        }
        _log(mes.join(''), 'error');
    }

    function clear() {
        debugLogEl.innerHTML = '';
    }

    exports.debug = {
        log  : log,
        error: error,
        clear: clear
    };

}(window, document, window));
