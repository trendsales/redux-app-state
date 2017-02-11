# redux-app-state
Time travel - optimized for web sites trying to be apps

[![Build Status](https://travis-ci.org/trendsales/redux-app-state.svg?branch=master)](https://travis-ci.org/trendsales/redux-app-state) [![Coverage Status](https://coveralls.io/repos/github/trendsales/redux-app-state/badge.svg?branch=master)](https://coveralls.io/github/trendsales/redux-app-state?branch=master) [![Code Climate](https://codeclimate.com/github/trendsales/redux-app-state/badges/gpa.svg)](https://codeclimate.com/github/trendsales/redux-app-state)

Description

## Installation

At the moment there is no direct means of installation. The closest thing is to clone the repository, run a build using `npm run build`, create a link for it using `npm link` and then using that link inside a project `npm link redux-app-state`.

A NPM package is in the works and will e released as soon as the project is ready.

## Usage

The project supplies three main components:

* Actions (`import { navigate, back, clean } from 'redux-app-state/action'`)
* Higher Order Reducer (`import { createHistoryReducer } from 'redux-app-state'`)
* Middleware (`import { createHistoryMiddleware } from 'redux-app-state'`)

In addition a set of navigation strategies are included

```javascript
import { createHistoryReducer, createHistoryMiddleware } from 'redux-app-state';
import { navigate } from 'redux-app-state/actions';
import withDismissed from 'redux-app-state/strategies/with-dismissed';
import { createStore, applyMiddleware } from 'redux';

const historyMiddleware = createHistoryMiddleware();
const historyReducer = createHistoryReducer(withDismissed);

const store = createStore(
  historyReducer(reducers),
  applyMiddleware(historyMiddleware)
);

store.dispatch(navigate('/'));
```

## Handling navigation

### resolveMeta

## APIs
In addition to strategies, different APIs can also be passed, to indicate how the application can update its environment, for instance if it should use `window.history`, hashes in the url or simple not reflect changes to the outside.

**nil** Does not effect its outside environment history tracking and page changing is done only in memory

**window** Uses `window.history` to manipulate the URL, back button interaction and alike. This also stores state in the browsers history state so refreshes can keep data about previous pages

**hash** (Not yet finished)

## Build in strategies
There are a few ready to go strategies, which defines how the history behaves.

**Default** If no strategy is provided it will pop the top page on back and nothing else.

**With dismissed** When navigating back, pages are not removed from the page list, but instead marked as dismissed in its meta data. When a new page is added all dismissed pages are removed.

## Custom strategies

### Options

**api** The API for handling out side integration.

**initState** If for instance a page is server side rendered, and should start using this data as its base, this data can be passed as initState data. Another alternative is to give the data as `preloaded` on first navigation request

**onBack** `(pageList:ImmutableList, requestMetaData:Object)=>pageList:ImmutableList` A function which takes a list of pages and updates it to its new state. This is called every time a back action is requested.
Default: `pageList => pageList.pop()`

**getCurrentPage** `(pageList:ImmutableList)=>index:Number` A function which is used to determin which page is currently the active. As for the `with-dismissed` strategy this finds the index of the last page in the list which is not dismissed.
Default: `pageList => pageList.size - 1;`

**beforeNavigate**

**mapToHistory**

**afterNavigate**
