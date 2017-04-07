import orgEnhancer from './enhancer';
import * as orgActions from './actions';
import orgMiddleware from './middleware';

export const createHistoryReducer = orgEnhancer;
export const actions = orgActions;
export const createHistoryMiddleware = orgMiddleware;
