import React from 'react';
import ReactDOM from 'react-dom';
import { createHistoryReducer, createHistoryMiddleware } from 'redux-app-state';
import withTabs from '../../lib/strategies/with-tabs';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import memory from 'memory';
import App from 'containers/app/app';
import {
  selectTab,
  showCalls,
} from 'actions/navigation';
import resolveMeta from 'router/resolve-meta'
import fallbacks from 'router/fallbacks';
import faker from 'faker';

console.log(withTabs);

const api = memory();

const historyMiddleware = createHistoryMiddleware({
  api,
  resolveMeta,
  getFallbackPage: fallbacks,
});
const historyReducer = createHistoryReducer(withTabs({
  api,
}));

const contacts = Array(100).fill(null).map(() => ({
  ...faker.helpers.createCard(),
  avatar: faker.image.avatar(),
}));

const reducer = (combineReducers({
  contacts: () => contacts,
}));

const store = global.store = createStore(
  historyReducer(reducer),
  applyMiddleware(historyMiddleware, logger),
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
