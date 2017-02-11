import { expect } from 'chai';
import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';

describe('enhancer', () => {
  describe('clean', () => {
    let state = null;
    let history = null;

    const reducer = (rState = { hello: 1, world: 2 }, action) => {
      if (action.type === 'INCREMENT') {
        rState.hello++;
        rState.world++;
      }
      return rState;
    };

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
    };

    before(() => {
      state = reducer(undefined, {});
      history = enhancer({
        api: nil,
        mapToHistory: (commitState, currentState) => ({
          hello: commitState.hello,
          world: currentState.world,
        }),
      })(reducer);
      expect(state.hello).to.be.equal(1);
      expect(state.world).to.be.equal(2);
    });

    it('should be able to combine two states', () => {
      navigate('1');
      expect(state.hello).to.be.equal(1);
      expect(state.world).to.be.equal(2);
    });

    it('should be able to take in state changes', () => {
      navigate('2');
      state = history(state, {
        type: 'INCREMENT',
      });
      expect(state.hello).to.be.equal(2);
      expect(state.world).to.be.equal(3);
    });

    it('back should only affect history part', () => {
      state = history(state, {
        type: '@@history/TRAVEL',
      });
      expect(state.hello).to.be.equal(1);
      expect(state.world).to.be.equal(3);
    });
  });
});
