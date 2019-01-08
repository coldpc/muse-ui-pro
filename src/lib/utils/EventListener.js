export default class EventListener{
    events = {};

    constructor(){

    }

  /**
   * 添加事件监听
   * @param name
   * @param call
   */
    addEventListener(name, call){
        if (this.events.hasOwnProperty(name)){
            this.events[name].push(call);
        }else{
            this.events[name] = [call];
        }
    }

  /**
   * 移出事件
   * @param name
   * @param call
   */
    removeEventListener(name, call){
        let event = this.events[name];
        if (event) {
            let listener;
            for (let i = 0, l = event.length; i < l; i++) {
                listener = event[i];
                if (listener === call) {
                    event.splice(i, 1);
                    break;
                }
            }
        }
    }

  /**
   * 触发事件
   * @param name
   * @param args
   */
    dispatch(name, ...args){
        let event = this.events[name];
        if (event) {
            let listener;
            for (let i = 0, l = event.length; i < l; i++) {
                listener = event[i];
                if (typeof listener === "function") {
                    listener(...args);
                }
            }
        }
    }
}
