/**
 * date: 2018-04-24
 * author: llwcy8801
 */

 import _ from '../util'
 const objectAgumentations = {}

_.define(objectAgumentations,  '$add', function (key, val) {
    if (this.hasOwnProperty(key)) return
    _.define(this, key, val, true)
    let ob = this.$observer
    ob.observer(key, val)
    ob.convert(key, val)
})

_.define(objectAgumentations, '$delete', function (key) {
    if (!this.hasOwnProperty(key)) return
    delete this[key]
})

module.exports = objectAgumentations