import enhancer from '../lib/enhancer';
import memory from '../lib/apis/memory';
import { expect } from 'chai';

describe('enhancer', () => {
  describe('history state', () => {
    let browserState = null;

    before(() => {
      browserState = memory();
    });

    it ('should update history state', () => {
      let state = {};
      let history = enhancer({
        api: browserState,
      })(state => state);

      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
        preloaded: { hello: 'universe' },
      });

      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });

      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'tes21',
      });

      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });

      let browser = browserState.getState();
      expect(browser).to.have.length(2);
      expect(browser[1].state.hello).to.be.equal('universe');
    });

    it ('should re-apply history state', () => {
      let state = {};
      let history = enhancer({
        api: browserState,
      })(state => state);
      state = history(state, { type: 'nil' });

      expect(state.history.pages).to.have.length(1);
    });
  });
});
