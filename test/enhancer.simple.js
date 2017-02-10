import enhancer from '../lib/enhancer';
import nil from '../lib/apis/nil';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('enhancer', () => {
  describe('simple', () => {
    let state = null;
    let history = null;
    let afterNavigate = null;

    before(() => {
      state = {};
      history = enhancer({
        api: nil,
        afterNavigate: () => { afterNavigate(); }
      })(() => {});
    });

    beforeEach(() => {
      afterNavigate = spy();
    });

    it('should not be initialized with any commits', () => {
      expect(history.getCommits().size).to.be.equal(0);
    });

    it('should only add commit internally on begin navigate', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test1',
      });
      expect(history.getCommits().size).to.be.equal(1);
      expect(state.history).to.exist;
      expect(state.history.pages).to.exist;
      expect(state.history.pages).to.have.length(0);
    });

    it('should add waiting commit when navigate request is send', () => {
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test1',
      });
      expect(history.getCommits().size).to.be.equal(1);
      expect(state.history).to.exist;
      expect(state.history.pages).to.exist;
      expect(state.history.pages).to.have.length(1);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
    });

    it('should be able to handle multible pages', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test2',
      });
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });
      expect(state.history.pages).to.have.length(2);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
      expect(state.history.pages[1]).to.be.eql({
        id: 1,
        meta: {},
        url: 'test2',
      });
    });

    it('should remove to top page on back', () => {
      state = history(state, {
        type: '@@history/TRAVEL'
      });
      expect(state.history.pages).to.have.length(1);
      expect(state.history.pages[0]).to.be.eql({
        id: 0,
        meta: {},
        url: 'test1',
      });
    });

    it('should not return ', () => {
      state = history(state, {
        type: '@@history/TRAVEL'
      });
      expect(state.history.pages).to.have.length(0);
    });

    it('should call after navigate', () => {
      state = history(state, {
        type: '@@history/BEFORE_NAVIGATE',
        url: 'test2',
      });
      state = history(state, {
        type: '@@history/NAVIGATE',
        url: 'test2',
      });

      expect(afterNavigate.callCount).to.be.equal(1);
    });
  });
});
