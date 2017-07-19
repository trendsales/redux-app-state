import { expect } from 'chai';
import { spy } from 'sinon';
import middleware from '../lib/middleware';
import nil from '../lib/apis/nil';

describe('middleware', () => {
  let dispatch = null;
  let instance = null;
  let pop = null;

  beforeEach(() => {
    global.document = {
      location: {},
    };
    dispatch = spy();
    instance = middleware({
      api: {
        ...nil,
        getState: () => true,
        listenForPop: (cb) => {
          pop = cb;
        },
      },
      resolveMeta: ({ meta }) => {
        dispatch(meta);
        return meta;
      },
    })({
      dispatch,
    });
  });

  it('should dispatch a BEGIN_NAVIGATE, followed by a NAVIGATE', () => instance(a => a)({
    type: '@@history/NAVIGATE',
    url: 'test1',
    meta: 'test2',
  }).then(() => {
    expect(dispatch.callCount).to.be.equal(3);
    expect(dispatch.firstCall.args[0].type).to.be.equal('@@history/BEFORE_NAVIGATE');
    expect(dispatch.secondCall.args[0]).to.be.equal('test2');
    expect(dispatch.thirdCall.args[0].type).to.be.equal('@@history/NAVIGATE');
  }));

  it('should just pass through other dispatches', () => {
    const next = spy();
    instance(next)({
      type: '@@hello/world',
    });
    expect(next.callCount).to.be.equal(1);
    expect(next.firstCall.args[0].type).to.be.equal('@@hello/world');
  });

  it('should dispatch a travel when history pop', () => {
    pop();
    expect(dispatch.callCount).to.be.equal(1);
    expect(dispatch.firstCall.args[0].type).to.be.equal('@@history/TRAVEL');
  });
});
