import React from 'react';
import ReactDOM from 'react-dom';
import { createHistoryReducer, createHistoryMiddleware } from 'redux-app-state';
import withTabs from '../../lib/strategies/with-tabs';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import App from 'containers/app/app';
import {
  selectTab,
  showCalls,
} from 'actions/navigation';
import resolveMeta from 'router/resolve-meta'
import fallbacks from 'router/fallbacks';

console.log(withTabs);

const historyMiddleware = createHistoryMiddleware({
  resolveMeta,
  getFallbackPage: fallbacks,
});
const historyReducer = createHistoryReducer(withTabs());

const reducer = (combineReducers({
  test: () => ({ a: 'b' }),
}));

const store = global.store = createStore(
  historyReducer((state = {}) => state),
  applyMiddleware(historyMiddleware, logger)
);

store.dispatch(selectTab('calls'));

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
)
