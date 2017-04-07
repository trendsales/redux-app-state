import React from 'react';
import ReactDOM from 'react-dom';
import { createHistoryReducer, createHistoryMiddleware } from 'redux-app-state';
import withDismissed from '../../lib/strategies/with-dismissed';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger'
import App from 'containers/app/app';
import {
  selectTab,
  showCalls,
} from 'actions/navigation';
import resolveMeta from 'router/resolve-meta'

const historyMiddleware = createHistoryMiddleware({
  resolveMeta,
});
const historyReducer = createHistoryReducer(withDismissed);

const reducer = (combineReducers({
  test: () => ({ a: 'b' }),
}));

const store = global.store = createStore(
  historyReducer((state = {}) => state),
  applyMiddleware(historyMiddleware, logger)
);

store.dispatch(selectTab('calls'));
store.dispatch(showCalls());

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
)
