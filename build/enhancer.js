'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _window = require('./apis/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOnBack = function defaultOnBack(pages) {
  return pages.pop();
};
var defaultGetCurrentPage = function defaultGetCurrentPage(pages) {
  return pages.size - 1;
};
var defaultOnBeforeNavigate = function defaultOnBeforeNavigate(pages) {
  return pages;
};
var defaultMapToHistory = function defaultMapToHistory(historyState) {
  return historyState;
};
var defaultHistoryApi = _window2.default;

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$api = _ref.api,
      api = _ref$api === undefined ? defaultHistoryApi : _ref$api,
      _ref$initState = _ref.initState,
      initState = _ref$initState === undefined ? null : _ref$initState,
      _ref$onBack = _ref.onBack,
      onBack = _ref$onBack === undefined ? defaultOnBack : _ref$onBack,
      _ref$getCurrentPage = _ref.getCurrentPage,
      getCurrentPage = _ref$getCurrentPage === undefined ? defaultGetCurrentPage : _ref$getCurrentPage,
      _ref$beforeNavigate = _ref.beforeNavigate,
      beforeNavigate = _ref$beforeNavigate === undefined ? defaultOnBeforeNavigate : _ref$beforeNavigate,
      _ref$mapToHistory = _ref.mapToHistory,
      mapToHistory = _ref$mapToHistory === undefined ? defaultMapToHistory : _ref$mapToHistory,
      afterNavigate = _ref.afterNavigate;

  return function (reducer) {
    var commits = null;
    var nextPageId = 0;
    var historyState = api.getState();
    if (historyState && Array.isArray(historyState)) {
      historyState.pop();
      commits = _immutable2.default.fromJS(historyState);
      commits = commits.map(function (commit) {
        return commit.set('id', nextPageId++);
      });
    } else {
      commits = _immutable2.default.fromJS([]);
    }

    var enhancer = function enhancer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState || {};
      var action = arguments[1];

      state = Object.assign({}, state);
      var currentPageId = getCurrentPage(commits);
      if (action.type === '@@history/BEFORE_NAVIGATE') {
        var beforeState = currentPageId >= 0 ? commits.getIn([currentPageId, 'state']).toJS() : initState || {};
        if (action.preloaded) {
          beforeState = action.preloaded;
        }
        commits = beforeNavigate(commits);
        var newPage = _immutable2.default.fromJS({
          id: nextPageId++,
          url: action.url,
          state: beforeState,
          resolved: false,
          extra: {}
        });
        commits = commits.push(newPage);
        currentPageId = getCurrentPage(commits);
      } else if (action.type === '@@history/NAVIGATE') {
        currentPageId = getCurrentPage(commits);
        commits = commits.setIn([currentPageId, 'resolved'], true);
        commits = commits.setIn([currentPageId, 'meta'], _immutable2.default.fromJS(action.meta || {}));
      } else if (action.type === '@@history/TRAVEL') {
        commits = onBack(commits, action.meta || {});
        currentPageId = getCurrentPage(commits);
      } else if (action.type === '@@history/CLEAN') {
        (function () {
          var query = action.query;
          commits = commits.filterNot(function (page) {
            return Object.keys(query).reduce(function (prev, key) {
              if (Array.isArray(query[key])) {
                return prev && query[key].indexOf(page.getIn(['meta', key])) >= 0;
              }
              return prev && page.getIn(['meta', key]) === query[key];
            }, true);
          });
          currentPageId = getCurrentPage(commits);
        })();
      }

      delete state.history; // Since combineHistory watches for unknown keys,
      // we need to temporarily remove it from the state.
      // This can be avoided by wrapping in an app and a
      // history state.
      if (currentPageId < 0 && action.type === '@@history/TRAVEL') {
        api.back();
        return Object.assign({}, mapToHistory({}, state), {
          history: { pages: [] }
        });
      }

      var commitState = commits.getIn([currentPageId, 'state']);
      var jsCommit = commitState ? commitState.toJS() : {};
      var mappedState = mapToHistory(jsCommit, state);
      var result = reducer(mappedState, action);

      var historyResult = Object.assign({}, result, {
        history: {
          pages: commits.filter(function (item) {
            return item.get('resolved');
          }).map(function (c) {
            return {
              id: c.get('id'),
              url: c.get('url'),
              meta: c.get('meta') ? c.get('meta').toJS() : {}
            };
          }).toJS()
        }
      });

      if (currentPageId >= 0) {
        commits = commits.setIn([currentPageId, 'state'], _immutable2.default.fromJS(historyResult));
      }

      var currentPage = commits.get(currentPageId);
      if (action.type === '@@history/NAVIGATE' || action.type === '@@history/TRAVEL') {
        if (action.type === '@@history/NAVIGATE') {
          api.replaceState(commits.toJS(), null, currentPage.get('url'));
        } else if (action.type === '@@history/TRAVEL' && global.history) {
          api.pushState(commits.toJS(), null, currentPage.get('url'));
        }

        if (afterNavigate) {
          afterNavigate(commits);
        }
      }

      return historyResult;
    };

    enhancer.getCommits = function () {
      return commits;
    };

    return enhancer;
  };
};