export default {
  getState: () => window.history.state,
  getCurrentUrl: () => global.location.href,
  pushState: (state, title, url) => {
    window.history.pushState(state, title, url);
  },
  replaceState: (state, title, url) => {
    window.history.replaceState(state, title, url);
  },
  back: () => {
    window.history.back();
  },
  listenForPop: (callback) => {
    window.addEventListener('popstate', callback);
  },
};
