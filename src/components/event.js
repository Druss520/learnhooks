class Event {
  constructor() {
      this.handlers = { // 记录所有的事件和处理函数

      }
  }
  /* *
  * on 添加事件监听
  * @param type 事件类型
  * @param handler 事件回调
  * on('click', ()=>{})
  * */
  on(type, handler, once=false) {
      if (!this.handlers[type]) {
          this.handlers[type] = [];
      }
      if (!this.handlers[type].includes(handler)) {
          this.handlers[type].push(handler);
          handler.once = once;
      }
  }
  /* *
  * off 取消事件监听
  * 
  *  */
  off(type, handler) {
      if (this.handlers[type]) {
          if (handler === undefined) {
              this.handlers[type] = []
          } else {
              this.handlers[type] = this.handlers[type].filter((f)=>{
                  return f!==handler
              })
          }
      }
  }
  /* *
  * @param type 要执行哪个类型的函数
  * @param eventData事件对象
  * @param point this指向
  * 
  *  */
  trigger(type, eventData = {}, point=this) {
      if (this.handlers[type]) {
          this.handlers[type].forEach(f => {
              f.call(point, eventData);
              if (f.once) {
                  this.off(type, f)
              }
          });
      }
  }
  /* *
  * once 函数执行一次
  * @param type 事件处理
  * @param handle 事件处理函数
  *  */
  once(type, handler) {
      this.on(type, handler, true);
  }
}

export default (function(){
  let instance
  if (!instance) {
    instance = new Event()
  }
  return instance
})()
