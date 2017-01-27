import Immutable from 'immutable';
import windowApi from './apis/window';

const defaultOnBack = pages => pages.pop();
const defaultGetCurrentPage = pages => pages.size - 1;
const defaultOnBeforeNavigate = pages => pages;
const defaultMapToHistory = historyState => historyState;
const defaultHistoryApi = windowApi;

export default ({
  api = defaultHistoryApi,
  initState = null,
  onBack = defaultOnBack,
  getCurrentPage = defaultGetCurrentPage,
  beforeNavigate = defaultOnBeforeNavigate,
  mapToHistory = defaultMapToHistory,
  afterNavigate,
} = {}) => (reducer) => {
  let commits = null;
  let nextPageId = 0;
  const historyState = api.getState();
  if (historyState && Array.isArray(historyState)) {
    historyState.pop();
    commits = Immutable.fromJS(historyState);
    commits = commits.map(commit => commit.set('id', nextPageId++));
  } else {
    commits = Immutable.fromJS([]);
  }

  const enhancer = (state = initState || {}, action) => {
    state = Object.assign({}, state);
    let currentPageId = getCurrentPage(commits);
    if (action.type === '@@history/BEFORE_NAVIGATE') {
      let beforeState = currentPageId >= 0
          ? commits.getIn([currentPageId, 'state']).toJS()
          : initState || {};
      if (action.preloaded) {
        beforeState = action.preloaded;
      }
      commits = beforeNavigate(commits);
      const newPage = Immutable.fromJS({
        id: nextPageId++,
        url: action.url,
        state: beforeState,
        resolved: false,
        extra: {},
      });
      commits = commits.push(newPage);
      currentPageId = getCurrentPage(commits);
    } else if (action.type === '@@history/NAVIGATE') {
      currentPageId = getCurrentPage(commits);
      commits = commits.setIn([currentPageId, 'resolved'], true);
      commits = commits.setIn([currentPageId, 'meta'], Immutable.fromJS(action.meta || {}));
    } else if (action.type === '@@history/TRAVEL') {
      commits = onBack(commits, action.meta || {});
      currentPageId = getCurrentPage(commits);
    } else if (action.type === '@@history/CLEAN') {
      const query = action.query;
      commits = commits.filterNot(page => Object.keys(query).reduce((prev, key) => {
        if (Array.isArray(query[key])) {
          return prev && (query[key].indexOf(page.getIn(['meta', key])) >= 0);
        }
        return prev && (page.getIn(['meta', key]) === query[key]);
      }, true));
      currentPageId = getCurrentPage(commits);
    }

    delete state.history; // Since combineHistory watches for unknown keys,
                          // we need to temporarily remove it from the state.
                          // This can be avoided by wrapping in an app and a
                          // history state.
    if (currentPageId < 0 && action.type === '@@history/TRAVEL') {
      api.back();
      return Object.assign({}, mapToHistory({}, state), {
        history: { pages: [] },
      });
    }

    const commitState = commits.getIn([currentPageId, 'state']);
    const jsCommit = commitState ? commitState.toJS() : {};
    const mappedState = mapToHistory(jsCommit, state);
    const result = reducer(mappedState, action);

    const historyResult = Object.assign({}, result, {
      history: {
        pages: commits.filter(item => item.get('resolved')).map(c => ({
          id: c.get('id'),
          url: c.get('url'),
          meta: c.get('meta') ? c.get('meta').toJS() : {},
        })).toJS(),
      },
    });

    if (currentPageId >= 0) {
      commits = commits.setIn([currentPageId, 'state'], Immutable.fromJS(historyResult));
    }

    const currentPage = commits.get(currentPageId);
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

  enhancer.getCommits = () => commits;

  return enhancer;
};
