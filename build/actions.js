'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var navigate = exports.navigate = function navigate(url, meta) {
  return {
    type: '@@history/NAVIGATE',
    url: url,
    meta: meta
  };
};

var back = exports.back = function back(meta) {
  return {
    type: '@@history/TRAVEL',
    meta: meta
  };
};

var clean = exports.clean = function clean(query) {
  return {
    type: '@@history/CLEAN',
    query: query
  };
};