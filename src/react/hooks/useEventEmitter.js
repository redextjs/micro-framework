import { useRef, useEffect } from 'react';

export class EventEmitter {
  constructor() {
    this.subscriptions = {};
  }

  emit = (eventName, value) => {
    const subscriptions = this.subscriptions[eventName] || [];

    // console.log('subscriptions', subscriptions, subscriptions.size)

    subscriptions.forEach((subscription) => subscription(value))
  };

  on = (eventName, callback) => {
    const callbackRef = useRef();
    callbackRef.current = callback;

    useEffect(() => {
      function handleSubscription(value) {
        if (callbackRef.current) {
          callbackRef.current(value);
        }
      }

      if (!this.subscriptions[eventName]) {
        this.subscriptions[eventName] = new Set();
      }

      this.subscriptions[eventName].add(handleSubscription);

      return () => {
        this.subscriptions[eventName].delete(handleSubscription);
      };
    }, []);
  };

  off = () => {
  }
}

function useEventEmitter() {
  const ref = useRef(null);

  if (!ref.current) {
    ref.current = new EventEmitter();
  }

  return ref.current;
}

export default useEventEmitter
