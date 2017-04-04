import { expect } from 'chai';
import { spy } from 'sinon';
import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';

describe('enhancer', () => {
  describe('tracking', () => {
    let state = null;
    let history = null;
    const trackingSpy = spy();

    before(() => {
      state = {};
      history = enhancer({
        api: nil,
        trackPageView: (...args) => {
          trackingSpy(...args);
        },
      })(() => {});
    });

    it('should not track on initial navigation', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
      });
      expect(trackingSpy.notCalled).to.be.true; // eslint-disable-line
    });

    it('should track on final navigation', () => {
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });
      expect(trackingSpy.calledOnce).to.be.true; // eslint-disable-line
    });
  });
});
