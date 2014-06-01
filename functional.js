(function(root, factory) {
    if (typeof exports === 'object') { // Node.js
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // Require.JS
        define(factory);
    } else {  // Browser globals
        root.jef = root.jef || {};
        root.jef.functional = factory();
    }
})(this, function(){
    'use strict';

    /**
     * Check if object is given type
     */
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas.toLowerCase() === type.toLowerCase();
    }

    /**
     * Check if value is function
     */
    function isFunction(value) {
        return is('function', value);
    }

    /**
     * Check if value is array
     */
    function isArray(value) {
        return is('array', value);
    }

    /**
     * Check if value is object
     */
    function isObject(value) {
        return is('object', value);
    }

    /**
     * Check if value is traversable
     *
     * @param  Array|Object  value
     * @return {Boolean}
     */
    function isTraversable(value) {
        return isArray(value) || isObject(value);
    }

    /**
     * Slice arguments
     */
    function slice(args, begin, end) {
        return Array.prototype.slice.call(args, begin, end);
    }

    /**
     * Retrieve key on a object
     *
     * Example:
     * get(1)(['a','b','c']) -> 'b'
     * get('length')(['a','b','c']) -> 3
     */
    function get(key) {
        return function (obj) {
            return obj[key];
        }
    }

    /**
     * Check if object has its own property
     *
     * @param  {[type]}  key
     * @return {Boolean}
     */
    function has(key) {
        return function (obj) {
            return obj.hasOwnProperty(key);
        }
    }

    /**
     * Set param in object property
     *
     * @param  {[type]}  key
     * @return {Boolean}
     */
    function set(key) {
        return function (obj) {
            return function(value) {
                obj[key] = value;
            };
        }
    }

    /**
     * Check if value is in array
     *
     * @param {Array} array
     * @param {[type]} value
     * @return {Integer}
     */
    function isIn(array, value) {
        return array.indexOf(value);
    }

    /**
     * Return first element from array
     */
    function first(array) {
        return get(0)(array);
    }

    /**
     * Evaluate function only when value is defined
     */
    function maybe(value, fn) {
        return value === null || value === undefined ? value : fn(value);
    }

    /**
     * Return negation of the value returned by function
     */
    function not(func) {
        return function() {
            return ! apply(func, arguments);
        };
    }

    /**
     * Transpose array, optionally apply function on each item;
     *
     * Examples:
     * From:
     * [
     *     [a,b],
     *     [c,d]
     * ]
     * To:
     * [
     *     [a, c]
     *     [b, d]
     * ]
     *
     * From:
     * [a,b,c]
     * To:
     * [
     *     [a],
     *     [b],
     *     [c]
     * ]
     */
    function transpose(array, func) {
        func = func || returnValue;

        if (!isArray(array)) {
            return [func(array)];
        }

        var result = [];
        each(array, function(value, col) {
            if (isArray(value)) {
                each(value, function(item, idx){
                    item = func(item);
                    result[idx] = result[idx] ? result[idx] : [];
                    result[idx][col] = item;
                });
            } else {
                result[col] = [func(value)];
            }
        });
        return result;
    }

    /**
     * Fill with value n-times array
     *
     * Examples:
     * fill(1, 2) -> [1, 1]
     */
    function fill(withValue, nTimes, array) {
        array = isArray(array) ? array : [];
        while(nTimes--) {
            array.push(withValue);
        }
        return array;
    }

    /**
     * Apply arguments to function
     *
     * Examples:
     * invoke(addition, [1,2]) -> 3
     * invoke(addition, [1,2], [2,3]) -> [3, 5]
     */
    function apply(func, args) {
        func = first(slice(arguments, 0, 1));
        args = slice(arguments, 1);
        var result = map(args, function(args) {
            switch(args && args.length) {
                case 0:  return func.call(func);
                case 1:  return func.call(func, args[0]);
                case 2:  return func.call(func, args[0], args[1]);
                default: return func.apply(func, args);
            }
        });
        return args.length > 1 ? result : first(result);
    }

    /**
     * Apply on list of arguments function but
     * arguments passed to function are taken by index
     *
     * Example:
     * applyc(multiply, [2,3], [4,5]) -> [8, 15]
     *
     * @param  Function func
     * @param  Array args
     * @return Array
     */
    function applyc(func, args) {
        func = first(slice(arguments, 0, 1));
        args = slice(arguments, 1);
        return map(
            transpose(args),
            curry(apply, func)
        );
    }

    /**
     * For each element form invoke method with arguments
     *
     * Examples:
     * invoke([{add: add1}, {add:add2}], add, [1]) -> [1, 2]
     */
    function invoke(list, method, args) {
        list = first(slice(arguments, 0, 1));
        method = slice(arguments, 1, 2);
        args = slice(arguments, 2);
        return map(list, function(item) {
            return args.length > 0 ? item[method].apply(item, args) : item[method]();
        });
    }

    /**
     * Apply function on each data element
     */
    function each(data, func) {
        var i, length, hasProp;
        switch(true) {
            case isArray(data):
                length = data.length;
                for (i = 0; i < length; i++) {
                    func(data[i], i);
                }
                break;

            case isObject(data):
                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        func(data[i], i);
                    }
                }
                break;
        }
    }

    /**
     * Map function
     *
     * Examples:
     * map([1, 2, 3], addOne) -> [2, 3, 4]
     * map([1, 2, 3], [2, 3, 6], addOne) -> [[2, 3, 4], [3, 4, 7]]
     *
     * @return []
     */
    function map(data, func) {
        data = slice(arguments, 0, -1);
        func = first(slice(arguments, -1));
        var result = [];
        each(data, function(item, idx){
            result[idx] = [];
            each(item, function(value, col) {
                result[idx][col] = func(value);
            })
        });
        return data.length > 1 ? result : first(result);
    }

    /**
     * Traverse on object
     * @param  {Function} obj
     * @param  {Function} func
     * @param  {Function} isNested
     */
    function traverse(obj, func, isNested) {
        if (!isFunction(func)) {
            throw TypeError('second argument is not a function');
        }
        isNested = isFunction(isNested) ? isNested : isTraversable;

        var level = 0;
        var eachFunction = curry(flip(each));
        var eachItem = eachFunction(function(item, k){
            var shoudlTraverse = isNested(item, k);
            var context = {
                level: level++,
                isLeaf: !shoudlTraverse
            };

            func.call(context, item, k);

            if (true === shoudlTraverse) {
                // Traverse this item
                eachItem(item);
            } else if (isTraversable(shoudlTraverse)) {
                // Travers item returned from validation function rather than current item
                // Thanks to that, we can customize our traverser to walk on specific nodes
                eachItem(shoudlTraverse);
            }

            --level;
        });
        eachItem(obj);
    }

    /**
     * Curry function
     *
     * Example:
     * curry(function(a, b, c, d)) -> a(b)(c)(d)
     */
    function curry(func) {
        var count = func.length;
        var args = slice(arguments, 1);
        if (!count)  {
            return func;
        }
        if (args.length < count) {
            return function carried() {
                var newArgs = [func];
                newArgs.push.apply(newArgs, args);
                newArgs.push.apply(newArgs, slice(arguments));
                return curry.apply(null, newArgs);
            }
        } else {
            return func.apply(null, args);
        }
    }

    /**
     * Composer function argument via another functions
     */
    function compose(base, first) {
        var more = arguments.length > 2;
        var functions = slice(arguments, 1);
        return function() {
            var args = slice(arguments);
            return base.apply(null, map(functions, function(func){
                return func.call(null, more ? args.shift() : args);
            }));
        }
    }

    /**
     * Reduce array to base using function
     */
    function reduce(data, func, base) {
        each(data, function(item) {
            base = func(item, base);
        });
        return base;
    }

    /**
     * Return new array containing values validated by function
     */
    function filter(data, func) {
        var result = [];
        each(data, function(item, i) {
            if (func(item, i)) {
                result.push(item);
            }
        });
        return result;
    }

    /**
     * Memorize function call with arguments
     * @param  Function func
     * @return Function
     */
    function memoize(func) {
        var cache = {};
        return function memorized() {
            var cacheKey = (arguments.length > 0)
                ? slice(arguments).join('::')
                : 'without_args';

            if (typeof cache[cacheKey] !== 'undefined') {
                return cache[cacheKey];
            }

            return cache[cacheKey] = func.apply(func, arguments);
        }
    }

    /**
     * Flip order of arguments when invoking function
     * @param  Function func
     * @return Function
     */
    function flip(func) {
        return function(arg1, arg2) {
            return apply(func, slice(arguments).reverse());
        }
    }

    /**
     * Return value function
     * Example: returnValue(1) -> 1
     */
    function returnValue(item) {
        return item;
    }

    /**
     * Return monadic value
     * Example: mv(1) -> f() -> 1
     */
    function mValue(value) {
        return function() {
            return value;
        }
    }

    /**
     * Merge two object into one
     */
    function merge(a, b) {
        var result = {};
        each(a, function(value, key) {
            result[key] = (key in b) ? b[key] : value
        });
        return result;
    }

    var exports = {};

    exports.apply         = apply;
    exports.applyc        = applyc;
    exports.compose       = compose;
    exports.curry         = curry;
    exports.fill          = fill;
    exports.filter        = filter;
    exports.flip          = flip;
    exports.each          = each;
    exports.get           = get;
    exports.has           = has;
    exports.invoke        = invoke;
    exports.is            = is;
    exports.isIn          = isIn;
    exports.isArray       = isArray;
    exports.isFunction    = isFunction;
    exports.isObject      = isObject;
    exports.isTraversable = isTraversable;
    exports.not           = not;
    exports.map           = map;
    exports.maybe         = maybe;
    exports.memoize       = memoize;
    exports.merge         = merge;
    exports.mValue        = mValue;
    exports.reduce        = reduce;
    exports.transpose     = transpose;
    exports.traverse      = traverse;
    exports.returnValue   = returnValue;
    exports.slice         = slice;

    return exports;
});
