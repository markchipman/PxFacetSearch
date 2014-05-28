(function() {
    
    // polyfills from MDN

    if(!Array.isArray) {
        Array.isArray = function (val) {
            return val instanceof Array;
        };
    }

    if (typeof Object.create !== 'function') {
        (function () {
            var F = function () {};
            Object.create = function (o) {
                if (arguments.length > 1) { 
                  throw new Error('Second argument not supported');
                }
                if (o === null) { 
                  throw new Error('Cannot set a null [[Prototype]]');
                }
                if (typeof o !== 'object') { 
                  throw new TypeError('Argument must be an object');
                }
                F.prototype = o;
                return new F();
            };
        })();
    }

    if (!Function.prototype.bind) {
      Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            NoOp = function () {},
            fBound = function () {
                return fToBind.apply(
                    this instanceof NoOp && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

        NoOp.prototype = this.prototype;
        fBound.prototype = new NoOp();

        return fBound;
      };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
          if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
          }

          var length = this.length >>> 0; // Hack to convert object.length to a UInt32

          fromIndex = +fromIndex || 0;

          if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
          }

          if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }

          for (;fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
              return fromIndex;
            }
          }

          return -1;
        };
      }


})();