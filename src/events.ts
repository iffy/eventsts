/**
 *  Generic emitter of events.
 */
export class EventSource<T> {
  private listeners:Array<{
    listener: (message:T)=>void|boolean|Promise<boolean>,
    remove?: boolean|'ifsuccessful',
  }> = [];
  
  private error_handler:((err:Error)=>void) = (err:Error) => {
    throw err;
  };

  /**
   *  Emit an event
   */
  emit(message:T) {
    this.listeners.slice().forEach(async obj => {
      let result;
      try {
        result = await obj.listener(message);
      } catch(err) {
        this.error_handler(err);
      }
      if (obj.remove === true
         || (obj.remove === 'ifsuccessful' && result === true)) {
        this.listeners.splice(this.listeners.indexOf(obj), 1);
      }
    })
  }

  /**
   *  If there's an error emitting an event, this is called
   */
  onError(handler:(err:Error)=>void):this {
    this.error_handler = handler;
    return this;
  }

  /**
   *  Call a function for all events.
   */
  on(listener:(message:T)=>void):this {
    this.listeners.push({
      listener,
    });
    return this
  }

  /**
   *  Call a function for the next event.
   */
  once(listener:(message:T)=>void):this {
    this.listeners.push({
      listener,
      remove: true,
    });
    return this
  }

  /**
   *  Call a function for all events until the function returns true.
   */
  untilTrue(listener:(message:T)=>boolean|Promise<boolean>):this {
    this.listeners.push({
      listener,
      remove: 'ifsuccessful',
    })
    return this;
  }

  /**
   *  Remove all event listeners
   */
  removeAllListeners():this {
    this.listeners = [];
    return this
  }

  /**
   * Remove a specific listener.
   */
  removeListener(listener:(message:T)=>void):this {
    let match = this.listeners.filter(obj => obj.listener === listener);
    if (match.length) {
      this.listeners.splice(this.listeners.indexOf(match[0]), 1)
    }
    return this;
  }
}
