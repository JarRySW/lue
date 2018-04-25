/**
 * date: 2018-04-23
 * author: llwcy8801
 */

 import _ from './util'
 import installGlobalAPI from './global-api'

 function Lue (options) {
    this._init(options)
 }

 Lue.prototype = {
    constructor: Lue,
    ...require('./instance/init'),
    ...require('./instance/compile'),
    ...require('./instance/element'),
    ...require('./instance/bindings'),
    ...require('./instance/scope'),
    ...require('./api/lifecycle'),
    ...require('./api/data'),
    ...require('./api/dom'),
    ...require('./compiler/compile-props'),
    ...require('./instance/api/events'),
    ...require('./instance/events')
 }

 Lue.options = {
    directives: {...require('./directives')},
    components: {}
 }

 installGlobalAPI(Lue)

 module.exports = window.Lue = _.Lue = Lue