import windowApi from './apis/window';
import { needsPatching } from './utils/platform';

let trapSet = false;
const defaultResolveMeta = ({ meta }) => meta;


export default ({
  resolveMeta = defaultResolveMeta,
  getFallbackPage = null,
  api = windowApi,
} = {}) => (store) => {
  let patched = !needsPatching(api.getUserAgent());
  let recovery = false;
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
      api.pushState({ ios: 'fix' }, null, api.getCurrentUrl());
    }
    trapSet = true;
  }

  // This means that when ever the user clicks back, we can not listen
  // for that event
  api.listenForPop(() => {
    if (patched) { // Fix for iOS 9.2 and below bug,
                                        // where initial view causes a popState

      // And if it happens, we can dispatch a travel event, which reverts to an
      // earlier commit, and then pushes that as a new page, to preserve the trap
      store.dispatch({
        type: '@@history/TRAVEL',
      });
    } else {
      patched = true;
    }
  });

  // We want to liste for all actions on the store
  return next => (action) => {
    // And if we see a navigate request, which has not et been resolved
    if (action.type === '@@history/NAVIGATE' && !action.resolved) {
      // We dispatch a `before navigate` request to create a new empty commit
      const returnValue = {};
      store.dispatch({
        ...action,
        type: '@@history/BEFORE_NAVIGATE',
        preloaded: (action.meta || {}).preloaded,
        returnValue,
      });

      const options = store.getState().history.options;

      // And then resolves the meta data for the requested page
      return Promise.resolve(resolveMeta({
        url: action.url,
        meta: action.meta || {},
        store,
        options,
        context: {
          onSetTitle: () => {},
          onSetMeta: () => {},
        },
      })).then((meta) => {
        // Once the meta data has been resolved we re-dispatch the navigation
        // action as resolved and with its meta data
        const updatedAction = {
          ...action,
          meta,
          pageId: returnValue.pageId,
          preloaded: (action.meta || {}).preloaded,
          resolved: true,
        };
        store.dispatch(updatedAction);
      });
    } else {
      const result = next(action);
      const state = store.getState();
      if (action.type === '@@history/SET_OPTIONS' && !recovery && state.history.currentPage.id === -1) {
        // Fetch new history action
        recovery = true;
        if (getFallbackPage) {
          const newAction = getFallbackPage(action, state.history.options);
          if (newAction) {
            return store.dispatch(newAction);
          }
        }
      } else if (recovery && state.history.pages.length !== 0) {
        recovery = false;
      }
      return result;
    }
  };
};
