export default (initState) => {
  const states = [
    initState,
  ];
  return {
    getState: () => states[states.length - 1],
    getCurrentUrl: () => null,
    pushState: (state) => { states.push(state); },
    replaceState: (state) => { states[states.length - 1] = state; },
    back: () => { states.pop(); },
    getUserAgent: () => 'user-agent',
    listenForPop: () => {},
  };
};
