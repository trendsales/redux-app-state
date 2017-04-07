import { expect } from 'chai';
import { spy } from 'sinon';
import middleware from '../lib/middleware';
import nil from '../lib/apis/nil';

describe('middleware', () => {
  let dispatch = null;
  let pop = null;
  let userAgent = null;

  describe('ios 9.2 and below', () => {
    beforeEach(() => {
      userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1';
      dispatch = spy();
      middleware({
        api: {
          ...nil,
          getState: () => true,
          listenForPop: (cb) => {
            pop = cb;
          },
          getUserAgent: () => userAgent,
        },
      })({
        dispatch,
      });
    });

    it('should ignore first travel on iOS below 9.3', () => {
      pop();
      pop();
      expect(dispatch.callCount).to.be.equal(1);
      expect(dispatch.firstCall.args[0].type).to.be.equal('@@history/TRAVEL');
    });
  });
});
