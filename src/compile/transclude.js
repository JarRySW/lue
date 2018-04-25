/**
 * date: 2018-04-23
 * author: llwcy8801
 */

 /**
  * {将template模板转化成DOM结构}
  * @param  [Element] 原DOM
  * @param  [Object] options
  * @return [DOM]
  */
module.exports = function (el, options) {
  let tpl = options.template

  if (!tpl) {
      return el
  }

  let ret = document.querySelector(options.template)
  if (ret) {
      return ret.content.children[0]
  }

  var parser = new DOMParser()
  var doc = parser.parseFromString(tpl, 'text/html')
    
  return doc.querySelector('body').firstChild
}