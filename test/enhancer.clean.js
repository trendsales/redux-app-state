import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';
import { expect } from 'chai';

describe('enhancer', () => {
  describe('clean', () => {
    let state = null;
    let history = null;

    const navigate = (url, meta = {}) => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url,
        meta,
      });
      state = history(state, {
        type: '@@history/NAVIGATE',
        url,
        meta,
      });
    }

    beforeEach(() => {
      state = {};
      history = enhancer({
        api: nil,
      })(() => {});
    });

    it('should be able to clean using filter', () => {
      navigate('1', {
        hello: 1,
      });
      navigate('2');
      navigate('3', {
        hello: 2,
      });

      expect(state.history.pages.map(p => p.meta.hello)).to.be.eql([1, undefined, 2]);
      expect(state.history.pages.map(p => p.url)).to.be.eql(['1', '2', '3']);

      state = history(state, {
        type: '@@history/CLEAN',
        query: { hello: 1 }
      });

      expect(state.history.pages.map(p => p.meta.hello)).to.be.eql([undefined, 2]);
      expect(state.history.pages.map(p => p.url)).to.be.eql(['2', '3']);

      navigate('4', {
        hello: 3,
      });

      expect(state.history.pages.map(p => p.url)).to.be.eql(['2', '3', '4']);

      state = history(state, {
        type: '@@history/CLEAN',
        query: { hello: [ 2, 3 ] }
      });

      expect(state.history.pages.map(p => p.url)).to.be.eql(['2']);
    });
  });
});
