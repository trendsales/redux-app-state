import enhancer from '../lib/enhancer';
import memory from '../lib/apis/memory';
import { expect } from 'chai';

describe('enhancer', () => {
  describe('init state', () => {
    it('should apply init state', () => {
      let state = {};
      let history = enhancer({
        api: memory(),
        initState: { hello: 'world' }
      })(state => state);

      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
      });

      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });

      expect(state.history).to.exist;
      expect(state.hello).to.be.eql('world');
    });

    it('should apply preloaded state', () => {
      let state = {};
      let history = enhancer({
        api: memory(),
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

      expect(state.history).to.exist;
      expect(state.hello).to.be.eql('universe');
    });
  });
});
