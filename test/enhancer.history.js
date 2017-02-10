import { expect } from 'chai';
import enhancer from '../lib/enhancer';
import memory from '../lib/apis/memory';

describe('enhancer', () => {
  describe('history state', () => {
    let browserState = null;

    before(() => {
      browserState = memory();
    });

    it('should update history state', () => {
      let state = {}; // eslint-disable-line
      const history = enhancer({
        api: browserState,
      })(s => s);

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
        url: 'test1',
      });

      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });

      const browser = browserState.getState();
      expect(browser).to.have.length(2);
      expect(browser[1].state.hello).to.be.equal('universe');
    });

    it('should re-apply history state', () => {
      let state = {};
      const history = enhancer({
        api: browserState,
      })(s => s);
      state = history(state, { type: 'nil' });

      expect(state.history.pages).to.have.length(1);
    });
  });
});
