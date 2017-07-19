import { expect } from 'chai';
import { spy } from 'sinon';
import middleware from '../lib/middleware';
import nil from '../lib/apis/nil';

describe('middleware', () => {
  let dispatch = null;
  let instance = null;

  describe('redirect', () => {
    beforeEach(() => {
      global.document = {
        location: {},
      };
      dispatch = spy();
      instance = middleware({
        api: {
          ...nil,
          getState: () => true,
        },
        resolveMeta: ({ url }) => {
          if (url === 'test1') {
            return {
              redirect: 'test2',
            };
          } else {
            return 'test3';
          }
        },
      })({
        dispatch,
      });
    });

    it('should redirect correctly', () => instance(a => a)({
      type: '@@history/NAVIGATE',
      url: 'test1',
      meta: 'test2',
    }).then(() => {
      expect(dispatch.callCount).to.be.equal(2);
      expect(dispatch.firstCall.args[0].type).to.be.equal('@@history/BEFORE_NAVIGATE');
      expect(dispatch.secondCall.args[0].type).to.be.equal('@@history/NAVIGATE');
      expect(dispatch.secondCall.args[0].meta).to.be.equal('test3');
      expect(dispatch.secondCall.args[0].url).to.be.equal('test2');
    }));
  });
});
