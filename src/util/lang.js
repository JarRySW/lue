/**
 * date: 2018-04-23
 * author: llwcy8801
 */

 exports.extend = function (to, from) {
    for (let key in from) {
        to[key] = from[key]
    }
 }

 /**
  * [定义对象属性]
  * @param  [Object] obj
  * @param  [String] key
  * @param  [*] val
  * @param  [Boolean] enumerable
  */
exports.define = function (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

/**
 * {代理属性}
 * @param  [Object] to
 * @param  [Object] from
 * @return [String] key
 */
 exports.proxy = function (to, from, key) {
    if (to.hasOwnProperty(key)) return
    Object.defineProperty(to, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return from[key]
        },
        set: function (val) {
            from[key] = val
        }
    })
 }

