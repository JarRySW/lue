/**
 * date: 2018-04-24
 * author: llwcy8801
 */

const argMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
const arrayAugmentations = []

argMethods.forEach((method) => {
    let original = Array.prototype[method]
    arrayAugmentations[method] = function () {
        let result = original.apply(this, arguments)
        let ob = this.$observer
        ob.notify('set', null, this.length)
        return result
    }
})

module.exports = arrayAugmentations