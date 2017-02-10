import { expect } from 'chai';
import enhancer from '../lib/enhancer';
import memory from '../lib/apis/memory';

describe('enhancer', () => {
  describe('init state', () => {
    it('should apply init state', () => {
      let state = {};
      const history = enhancer({
        api: memory(),
        initState: { hello: 'world' },
      })(s => s);

      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
      });

      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });

      expect(state.hello).to.be.eql('world');
    });

    it('should apply preloaded state', () => {
      let state = {};
      const history = enhancer({
        api: memory(),
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

      expect(state.hello).to.be.eql('universe');
    });
  });
});
