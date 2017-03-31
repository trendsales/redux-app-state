import windowApi from './apis/window';

const defaultOnBack = (pages) => {
  pages.pop();
  return pages;
};
const defaultGetCurrentPage = pages => pages.length - 1;
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
  // All forward navigations results in a new "commit" being added, which
  // will be manipulated on back actions and before page changes to
  // support an app like navigation
  let commits = null;

  // This is simply to insure all pages get an ID which is higher than the
  // page before it.
  let nextPageId = 0;

  // First of we start by getting the current pages stored history, if any
  // to see if we are continuing a previous session
  const historyState = api.getState();

  // if we have, and it is in an expected format...
  if (historyState && Array.isArray(historyState)) {
    // we start by removing the last entry, as this is the page we are currently
    // on. This ensures that a refreshed page does not end up with stale data.
    historyState.pop();
    // Then we simply just add the rest back as commits
    commits = historyState;
    // and give them new IDs
    commits.forEach((commit) => {
      commit.id = nextPageId++;
    });
  } else {
    // If we are not continuing a previous session, we simple create an empty
    // commit list to work on
    commits = [];
  }

  // we then create the higher order reducer. if a init state is given
  // this will also be the init state of the reducer
  const enhancer = (state = initState || {}, action) => {
    // We add a bit of safe guardin to avoid side effects
    state = Object.assign({}, state);
    // Then we fetch the ID of the top most active page in our commits
    // (This is defined using the getCurrentPage, so it does not have to be
    // the last commit)
    let currentPageId = getCurrentPage(commits);
    // Since the first thing we need to do, when a new page is added is to
    // create a space for it, we already add it to the commit list, even before
    // the actual navigation
    if (action.type === '@@history/BEFORE_NAVIGATE') {
      // We test if there is a previous page, which state we should base this
      // commits state upon, if not, we use the init state, or simply gives it
      // an empty state
      let beforeState = currentPageId >= 0
          ? commits[currentPageId].state
          : initState || state || {};
      // If the action passes preloaded data, we use that as the basis state for
      // our commit
      if (action.preloaded) {
        beforeState = action.preloaded;
      }
      // We then filter our previous commits using the `beforeNavigate`
      // method provided
      commits = beforeNavigate(commits);
      // And then we create our methodnew commit
      const newPage = {
        id: nextPageId++,
        url: action.url,
        state: beforeState,
        resolved: false,  // The commit is marked as unresolved, so that we
                          // know that is is not yet processed, and therefore
                          // should not yet be a part of the redux stores state
        extra: {},
        meta: {},
      };
      commits.push(newPage);
      // And we now update our current page ID, as a new page has been added
      currentPageId = getCurrentPage(commits);

    // After a navigation has been resolved by the middleware, it is then
    // navigated to.
    } else if (action.type === '@@history/NAVIGATE') {
      // We again insures that the currentPageId is up to date
      currentPageId = getCurrentPage(commits);
      // and markes that page as resolved, so it will be passed
      // to the redux store
      commits[currentPageId].resolved = true;
      // And add its resolved meta data
      commits[currentPageId].meta = action.meta || {};

    // Going back in time:
    } else if (action.type === '@@history/TRAVEL') {
      // We update the page list based upon the onBack function
      commits = onBack(commits, action.meta || {});
      // And update the currentPageId to be that of the new current page
      currentPageId = getCurrentPage(commits);

    // Cleaning up:
    } else if (action.type === '@@history/CLEAN') {
      const query = action.query;
      // We run through all commits to filter out all pages which satisfies our
      // query criterias
      commits = commits.filter(page => !Object.keys(query).reduce((prev, key) => {
        if (Array.isArray(query[key])) {
          return prev && (query[key].indexOf(page.meta[key]) >= 0);
        }
        return prev && page.meta[key] === query[key];
      }, true));
      // And ensures that currentPageId is up to date
      currentPageId = getCurrentPage(commits);
    }

    delete state.history; // Since combineHistory watches for unknown keys,
                          // we need to temporarily remove it from the state.
                          // This can be avoided by wrapping in an app and a
                          // history state.

    // If we have travelled further back then there is pages we need
    // to do an additional back to exit out of our browser history trap
    if (currentPageId < 0 && action.type === '@@history/TRAVEL') {
      api.back();
      // And to leave all nice and tighty, we simulate that the history
      // controlled state is now empty
      return Object.assign({}, mapToHistory({}, state), {
        history: { pages: [] },
      });
    }

    // We start by fetching the state of the current page
    const commitState = commits[currentPageId].state;
    // Then we apply the mapping function between the current reducer
    // state and the one from the current page to only take what we want
    // to have controlled by the history
    const mappedState = mapToHistory(commitState, state);
    // And then we pass that to the original reducer
    const result = reducer(mappedState, action);
    // Then we take our commits and transforms them to a list to pass along
    // to redux, and add it to the result
    const historyResult = Object.assign({}, result, {
      history: {
        pages: commits.filter(item => item.resolved).map(c => ({
          id: c.id,
          url: c.url,
          meta: c.meta || {},
        })),
      },
    });

    if (currentPageId >= 0) {
      // We then stores that state on the current page's commit
      commits[currentPageId].state = historyResult;
    }

    // Then we fetch the actual current page
    const currentPage = commits[currentPageId];
    if (action.type === '@@history/NAVIGATE' || action.type === '@@history/TRAVEL') {
      if (action.type === '@@history/NAVIGATE') {
        // and if we are moving forward we replace the top page with the new page
        api.replaceState(commits, null, currentPage.url);
      } else if (action.type === '@@history/TRAVEL') {
        // or if we are moving back, we add a new page on top
        api.pushState(commits, null, currentPage.url);
      }

      // Lastly if we have some after navigation actions, we run them here.
      // This for instance would be an ideal place for tracking
      if (afterNavigate) {
        afterNavigate(commits);
      }
    }

    // Once all that is done, we return the result, including the page history
    return historyResult;
  };

  enhancer.getCommits = () => commits;

  return enhancer;
};
