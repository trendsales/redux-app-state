import { expect } from 'chai';
import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';

describe('enhancer', () => {
  describe('simple', () => {
    let state = null;
    let history = null;
    before(() => {
      state = {};
      history = enhancer({
        api: nil,
        beforeNavigate: (pages, meta, options) => {
          expect(options).to.be.eql({
            hello: 'world',
          });
          return pages;
        },
      })(() => {});
    });

    it('should be able to set options', () => {
      state = history(state, {
        type: '@@history/SET_OPTIONS',
        options: {
          hello: 'world',
        },
      });
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: '/test',
      });
    });
  });
});
