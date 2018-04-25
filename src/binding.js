/**
 * date: 2018-04-24
 * author: llwcy8801
 */

function Binding () {
    // 存放watcher实例
    this._subs = []
}

Binding.prototype._addChild = function (key) {
    return this[key] || new Binding()
}

Binding.prototype._addSub = function (sub) {
    this._subs.push(sub)
}

module.exports = Binding