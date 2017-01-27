let trapSet = false;

export default ({ resolveMeta, api } = {}) => (store) => {
  if (!trapSet) {
    const state = api.getState();
    if (!state || !Array.isArray(state)) {
      api.replaceState({ ios: 'fix' }, null, api.getCurrentUrl());
      api.pushState({ ios: 'fix' }, null, api.getCurrentUrl());
    }
    trapSet = true;
  }

  api.listenForPop(() => {
    const state = api.getState();
    if (state) {  // Fix for iOS 9.2 and below bug,
                  // where initial view causes a popState
      store.dispatch({
        type: '@@history/TRAVEL',
      });
    }
  });

  return next => (action) => {
    if (action.type === '@@history/NAVIGATE' && !action.resolved) {
      store.dispatch(Object.assign({}, action, {
        type: '@@history/BEFORE_NAVIGATE',
        preloaded: (action.meta || {}).preloaded,
      }));
      return resolveMeta({
        url: action.url,
        meta: action.meta || {},
        store,
        context: {
          onSetTitle: () => {},
          onSetMeta: () => {},
        },
      }).then((meta) => {
        const updatedAction = Object.assign({}, action, {
          meta,
          preloaded: (action.meta || {}).preloaded,
          resolved: true,
        });
        store.dispatch(updatedAction);
      });
    } else {
      return next(action);
    }
  };
};
