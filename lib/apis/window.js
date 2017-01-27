export default {
  getState: () => global.history.state,
  getCurrentUrl: () => global.location.href,
  pushState: (state, title, url) => {
    global.pushState(state, title, url);
  },
  replaceState: (state, title, url) => {
    global.replaceState(state, title, url);
  },
  back: () => {
    global.history.back();
  },
  listenForPop: (callback) => {
    global.addEventListener('popstate', callback);
  },
};
