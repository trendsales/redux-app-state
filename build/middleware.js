'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var trapSet = false;

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      resolveMeta = _ref.resolveMeta,
      api = _ref.api;

  return function (store) {
    if (!trapSet) {
      var state = api.getState();
      if (!state || !Array.isArray(state)) {
        api.replaceState({ ios: 'fix' }, null, api.getCurrentUrl());
        api.pushState({ ios: 'fix' }, null, api.getCurrentUrl());
      }
      trapSet = true;
    }

    api.listenForPop(function () {
      var state = api.getState();
      if (state) {
        // Fix for iOS 9.2 and below bug,
        // where initial view causes a popState
        store.dispatch({
          type: '@@history/TRAVEL'
        });
      }
    });

    return function (next) {
      return function (action) {
        if (action.type === '@@history/NAVIGATE' && !action.resolved) {
          store.dispatch(Object.assign({}, action, {
            type: '@@history/BEFORE_NAVIGATE',
            preloaded: (action.meta || {}).preloaded
          }));
          return resolveMeta({
            url: action.url,
            meta: action.meta || {},
            store: store,
            context: {
              onSetTitle: function onSetTitle() {},
              onSetMeta: function onSetMeta() {}
            }
          }).then(function (meta) {
            var updatedAction = Object.assign({}, action, {
              meta: meta,
              preloaded: (action.meta || {}).preloaded,
              resolved: true
            });
            store.dispatch(updatedAction);
          });
        } else {
          return next(action);
        }
      };
    };
  };
};