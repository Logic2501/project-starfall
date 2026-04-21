(function () {
  const listeners = new Map();
  Starfall.events = {
    on: (name, fn) => {
      const arr = listeners.get(name) || [];
      arr.push(fn);
      listeners.set(name, arr);
    },
    emit: (name, payload) => {
      (listeners.get(name) || []).forEach((fn) => fn(payload));
    }
  };
})();
