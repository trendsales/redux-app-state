'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  getState: function getState() {
    return global.history.state;
  },
  getCurrentUrl: function getCurrentUrl() {
    return global.location.href;
  },
  pushState: function pushState(state, title, url) {
    global.pushState(state, title, url);
  },
  replaceState: function replaceState(state, title, url) {
    global.replaceState(state, title, url);
  },
  back: function back() {
    global.history.back();
  },
  listenForPop: function listenForPop(callback) {
    global.addEventListener('popstate', callback);
  }
};