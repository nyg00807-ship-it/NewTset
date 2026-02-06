(() => {
  const listeners = new Set();

  const state = {
    customers: [],
    consultations: [],
    selectedCustomerId: null,
    searchQuery: "",
    filters: {
      type: "ALL",
      status: "ALL",
      sort: "DESC"
    },
    errors: {
      customers: null,
      consultations: null
    }
  };

  const setState = (partial) => {
    Object.assign(state, partial);
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  window.CRM.state.store = { state, setState, subscribe };
})();
