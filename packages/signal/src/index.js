"use strict";
// tslint:disable
/**
 *    @desc       A TypeScript conversion of JS Signals by Miller Medeiros
 *               Released under the MIT license
 *                http://millermedeiros.github.com/js-signals/
 *
 *    @version    1.0 - 7th March 2013
 *
 *    @author    Richard Davey, TypeScript conversion
 *    @author        Miller Medeiros, JS Signals
 *    @author        Robert Penner, AS Signals
 *
 *    @url        http://www.photonstorm.com
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", {value: true});
var utils_1 = require("@local/utils");
/**
 * Custom event broadcaster
 * <br />- inspired by Robert Penner's AS3 Signals.
 * @name Signal
 * @author Miller Medeiros
 * @constructor
 */
var Signal = /** @class */ (function () {
    function Signal() {
        /**
         * @property _bindings
         * @type Array
         * @private
         */
        this._bindings = [];
        /**
         * @property _prevParams
         * @type Any
         * @private
         */
        this._prevParams = null;
        /**
         * If Signal should keep isRecording of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        this.memorize = false;
        /**
         * @type boolean
         * @private
         */
        this._shouldPropagate = true;
        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        this.active = true;
    }

    /**
     * @method validateListener
     * @param {Any} listener
     * @param {Any} fnName
     */
    Signal.prototype.validateListener = function (listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }
    };
    /**
     * @param {Function} listener
     * @param {boolean} isOnce
     * @param {Object} [listenerContext]
     * @param {Number} [priority]
     * @return {SignalBinding}
     * @private
     */
    Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;
        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];
            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        }
        else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
            this._addBinding(binding);
        }
        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }
        return binding;
    };
    /**
     * @method _addBinding
     * @param {SignalBinding} binding
     * @private
     */
    Signal.prototype._addBinding = function (binding) {
        //simplified insertion sort
        var n = this._bindings.length;
        do {
            --n;
        } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
        this._bindings.splice(n + 1, 0, binding);
    };
    /**
     * @method _indexOfListener
     * @param {Function} listener
     * @return {number}
     * @private
     */
    Signal.prototype._indexOfListener = function (listener, context) {
        var n = this._bindings.length;
        var cur;
        while (n--) {
            cur = this._bindings[n];
            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }
        return -1;
    };
    /**
     * Check if listener was attached to Signal.
     * @param {Function} listener
     * @param {Object} [context]
     * @return {boolean} if Signal has the specified listener.
     */
    Signal.prototype.has = function (listener, context) {
        if (context === void 0) {
            context = null;
        }
        return this._indexOfListener(listener, context) !== -1;
    };
    /**
     * Add a listener to the signal.
     * @param {Function} listener Signal handler function.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     * @return {SignalBinding} An Object representing the binding between the Signal and listener.
     */
    Signal.prototype.add = function (listener, listenerContext, priority) {
        if (listenerContext === void 0) {
            listenerContext = null;
        }
        if (priority === void 0) {
            priority = 0;
        }
        this.validateListener(listener, 'add');
        return this._registerListener(listener, false, listenerContext, priority);
    };
    /**
     * Add listener to the signal that should be removed after first execution (will be executed only once).
     * @param {Function} listener Signal handler function.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     * @return {SignalBinding} An Object representing the binding between the Signal and listener.
     */
    Signal.prototype.addOnce = function (listener, listenerContext, priority) {
        if (listenerContext === void 0) {
            listenerContext = null;
        }
        if (priority === void 0) {
            priority = 0;
        }
        this.validateListener(listener, 'addOnce');
        return this._registerListener(listener, true, listenerContext, priority);
    };
    /**
     * Remove a single listener from the dispatch queue.
     * @param {Function} listener Handler function that should be removed.
     * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
     * @return {Function} Listener handler function.
     */
    Signal.prototype.remove = function (listener, context) {
        if (context === void 0) {
            context = null;
        }
        this.validateListener(listener, 'remove');
        var i = this._indexOfListener(listener, context);
        if (i !== -1) {
            this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
            this._bindings.splice(i, 1);
        }
        return listener;
    };
    /**
     * Remove all listeners from the Signal.
     */
    Signal.prototype.removeAll = function () {
        var n = this._bindings.length;
        while (n--) {
            this._bindings[n]._destroy();
        }
        this._bindings.length = 0;
    };
    /**
     * @return {number} Number of listeners attached to the Signal.
     */
    Signal.prototype.getNumListeners = function () {
        return this._bindings.length;
    };
    /**
     * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
     * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
     * @see Signal.prototype.disable
     */
    Signal.prototype.halt = function () {
        this._shouldPropagate = false;
    };
    /**
     * Dispatch/Broadcast Signal to all listeners added to the queue.
     * @param {...*} [params] Parameters that should be passed to each handler.
     */
    Signal.prototype.dispatch = function () {
        var paramsArr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paramsArr[_i] = arguments[_i];
        }
        if (!this.active) {
            return;
        }
        var n = this._bindings.length;
        var bindings;
        if (this.memorize) {
            this._prevParams = paramsArr;
        }
        if (!n) {
            //should come after memorize
            return;
        }
        bindings = this._bindings.slice(0); //clone array in case add/remove list during dispatch
        this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.
        //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
        //reverse loop since listeners with higher priority will be added at the end of the list
        do {
            n--;
        } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
    };
    /**
     * Forget memorized arguments.
     * @see Signal.memorize
     */
    Signal.prototype.forget = function () {
        this._prevParams = null;
    };
    /**
     * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
     * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
     */
    Signal.prototype.dispose = function () {
        this.removeAll();
        delete this['_bindings'];
        delete this['_prevParams'];
    };
    /**
     * @return {string} String representation of the object.
     */
    Signal.prototype.toString = function () {
        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
    };
    /**
     * Signals Version Number
     * @property VERSION
     * @type String
     * @const
     */
    Signal.VERSION = '1.0.2';
    return Signal;
}());
exports.Signal = Signal;
/*
 *	@desc   	An object that represents a binding between a Signal and a listener function.
 *               Released under the MIT license
 *				http://millermedeiros.github.com/js-signals/
 *
 *	@guid	1.0 - 7th March 2013
 *
 *	@author 	Richard Davey, TypeScript conversion
 *	@author		Miller Medeiros, JS Signals
 *	@author		Robert Penner, AS Signals
 *
 *	@url		http://www.kiwijs.org
 *
 */
var SignalBinding = /** @class */ (function () {
    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
        if (priority === void 0) {
            priority = 0;
        }
        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        this.active = true;
        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        this.params = null;
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;
    }

    /**
     * Call listener passing arbitrary parameters.
     * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
     * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
     * @return {*} Value returned by the listener.
     */
    SignalBinding.prototype.execute = function (paramsArr) {
        var handlerReturn;
        var params;
        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);
            if (this._isOnce) {
                this.detach();
            }
        }
        return handlerReturn;
    };
    /**
     * Detach binding from signal.
     * - alias to: mySignal.remove(myBinding.getListener());
     * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
     */
    SignalBinding.prototype.detach = function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    };
    /**
     * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
     */
    SignalBinding.prototype.isBound = function () {
        return (!!this._signal && !!this._listener);
    };
    /**
     * @return {boolean} If SignalBinding will only be executed once.
     */
    SignalBinding.prototype.isOnce = function () {
        return this._isOnce;
    };
    /**
     * @return {Function} Handler function bound to the signal.
     */
    SignalBinding.prototype.getListener = function () {
        return this._listener;
    };
    /**
     * @return {Signal} Signal that listener is currently bound to.
     */
    SignalBinding.prototype.getSignal = function () {
        return this._signal;
    };
    /**
     * Delete instance properties
     * @private
     */
    SignalBinding.prototype._destroy = function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    };
    /**
     * @return {string} String representation of the object.
     */
    SignalBinding.prototype.toString = function () {
        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
    };
    return SignalBinding;
}());
exports.SignalBinding = SignalBinding;
/**
 * Guid based temporary signal, for use into dangerouslyRenderHTML
 */
var WindowSignal = /** @class */ (function (_super) {
    __extends(WindowSignal, _super);

    function WindowSignal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    WindowSignal.dispatch = function (guid) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (WindowSignal._signals.has(guid))
            WindowSignal._signals.get(guid).dispatch.apply(WindowSignal._signals.get(guid), params);
    };
    WindowSignal.randomGUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    WindowSignal.registerWithGUID = function (signal) {
        var guid = WindowSignal.randomGUID();
        while (WindowSignal._signals.has(guid))
            guid = WindowSignal.randomGUID();
        WindowSignal._signals.set(guid, signal);
        return guid;
    };
    Object.defineProperty(WindowSignal.prototype, "guid", {
        get: function () {
            if (this._guid === undefined)
                this._guid = WindowSignal.registerWithGUID(this);
            return this._guid;
        },
        enumerable: true,
        configurable: true
    });
    WindowSignal.prototype.dispose = function () {
        WindowSignal._signals.delete(this._guid);
        _super.prototype.dispose.call(this);
    };
    WindowSignal._signals = new Map();
    return WindowSignal;
}(Signal));
exports.WindowSignal = WindowSignal;
if (utils_1.isFrontend())
    window['windowSignals'] = WindowSignal;
