# eventsts

A simple, typed event emitter.  Use it like this:

```typescript
import { EventSource } from 'eventsts'

interface MyEventType {
  name: string;
}

const emitter = new EventSource<MyEventType>();

// Watch for messages
emitter.on(message => {
  // message's type is MyEventType
  console.log("name", message.name);
});

// Emit a message
emitter.emit({name: 'something'});
```

Other things you can do:

```typescript
emitter.once(message => {
  // called only once on the next event
})

emitter.untilTrue(message => {
  // called until this returns true
  if (message.name === 'bob') {
    // disable this handler
    return true;
  }
})

emitter.removeAllListeners();

function someListener(message:MyEventType) {
  console.log('some listener', message.name);
}
emitter.on(someListener);
emitter.removeListener(someListener);
```

And to handle errors (by default it will throw errors):

```typescript
emitter.onError(err => {
  console.error(err);
})
```


# Publishing


    npm publish