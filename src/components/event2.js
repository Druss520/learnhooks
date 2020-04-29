export default (function () {
  var events = {}
  
  var on = function (name, fn, bind) {
    if (!events[name]) {
      events[name] = []
    }
    events[name].push({fn: fn, bind: bind})
  }
  
  var off = function (name, fn) {
    var fns = events[name]
    if (!fns) {
      return false
    }
    if (!fn) {
      fns.length = 0
    } else {
      for (var l = fns.length - 1; l >=0; l-- ) {
        var _fnObj = fns[l]
        if (_fnObj.fn === fn) {
          fns.splice(l, 1)
        }
      }
    }
  }
  
  var trigger = function () {
    var name = Array.prototype.shift.call(arguments)
    var fns = events[name]
    if (!fns || fns.length === 0) {
      return false
    }
    for (var i = 0, fnObj; fnObj = fns[i++];) {
      fnObj.fn.apply(fnObj.bind || this, arguments)
    }
  }
  
  return {
    on: on,
    off: off,
    trigger: trigger
  }
})()
