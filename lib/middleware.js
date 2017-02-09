let trapSet = false;

export default ({ resolveMeta, api } = {}) => (store) => {
  // Since we want to control the browser beyond simple linear navigations
  // we need to trap it so that we can control the back button.
  // this is done by introducing a new page, so, when the user clicks the back
  // button, this is an event we can capture
  if (!trapSet) {
    const state = api.getState();
    // we start by testing that the current state stored in the browser is
    // not a previous session
    // If it isn't we set the trap
    if (!state || !Array.isArray(state)) {
      api.replaceState({ ios: 'fix' }, null, api.getCurrentUrl());
      api.pushState({ ios: 'fix' }, null, api.getCurrentUrl());
    }
    trapSet = true;
  }

  // This means that when ever the user clicks back, we can not listen
  // for that event
  api.listenForPop(() => {
    const state = api.getState();
    if (state) {  // Fix for iOS 9.2 and below bug,
                  // where initial view causes a popState

      // And if it happens, we can dispatch a travel event, which reverts to an
      // earlier commit, and then pushes that as a new page, to preserve the trap
      store.dispatch({
        type: '@@history/TRAVEL',
      });
    }
  });

  // We want to liste for all actions on the store
  return next => (action) => {
    // And if we see a navigate request, which has not et been resolved
    if (action.type === '@@history/NAVIGATE' && !action.resolved) {
      // We dispatch a `before navigate` request to create a new empty commit
      store.dispatch(Object.assign({}, action, {
        type: '@@history/BEFORE_NAVIGATE',
        preloaded: (action.meta || {}).preloaded,
      }));

      // And then resolves the meta data for the requested page
      return resolveMeta({
        url: action.url,
        meta: action.meta || {},
        store,
        context: {
          onSetTitle: () => {},
          onSetMeta: () => {},
        },
      }).then((meta) => {
        // Once the meta data has been resolved we re-dispatch the navigation
        // action as resolved and with its meta data
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
