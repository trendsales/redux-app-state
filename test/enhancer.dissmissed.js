import { expect } from 'chai';
import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';
import withDismissed from '../lib/strategies/with-dismissed';

describe('enhancer', () => {
  describe('strategies', () => {
    describe('with dismissed', () => {
      let state = null;
      let history = null;

      const navigate = (url) => {
        state = history(state, {
          type: '@@history/BEFORE_NAVIGATE',
          url,
        });
        state = history(state, {
          type: '@@history/NAVIGATE',
          url,
        });
      };

      before(() => {
        state = {};
        history = enhancer(withDismissed({
          api: nil,
        }))(() => {});
        navigate('1');
        navigate('2');
        navigate('3');
      });

      it('should not remove the top page on back', () => {
        state = history(state, {
          type: '@@history/TRAVEL',
        });
        expect(state.history.pages).to.have.length(3);
        expect(state.history.pages.map(p => !!p.meta.dismissed)).to.be.eql([false, false, true]);
        expect(state.history.pages.map(p => p.url)).to.be.eql(['1', '2', '3']);

        state = history(state, {
          type: '@@history/TRAVEL',
        });
        expect(state.history.pages).to.have.length(3);
        expect(state.history.pages.map(p => !!p.meta.dismissed)).to.be.eql([false, true, true]);
        expect(state.history.pages.map(p => p.url)).to.be.eql(['1', '2', '3']);
      });

      it('should remove the dismissed pages after a new navigation', () => {
        navigate('4');
        expect(state.history.pages).to.have.length(2);
        expect(state.history.pages.map(p => !!p.meta.dismissed)).to.be.eql([false, false]);
        expect(state.history.pages.map(p => p.url)).to.be.eql(['1', '4']);
      });
    });
  });
});
