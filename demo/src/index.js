import React from 'react';
import ReactDOM from 'react-dom';
import { createHistoryReducer, createHistoryMiddleware } from 'redux-app-state';
import { navigate } from '../../lib/actions';
import withDismissed from '../../lib/strategies/with-dismissed';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/app';

import employees from './reducers/employees';

const historyMiddleware = createHistoryMiddleware();
const historyReducer = createHistoryReducer(withDismissed);

const reducer = combineReducers({
  employees,
});

const store = createStore(
  historyReducer((state = {}) => state),
  applyMiddleware(historyMiddleware)
);

store.dispatch(navigate('/'));

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
)
